import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Merge a session cart into a user's cart on login
// Body: { userId: string, sessionId?: string }
export async function POST(req: Request) {
  try {
    const { userId, sessionId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Ensure user cart exists
    const userCart = await prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    if (!sessionId) {
      const cartWithItems = await prisma.cart.findUnique({
        where: { id: userCart.id },
        include: { items: true },
      });
      return NextResponse.json(cartWithItems);
    }

    // Find session cart (guest)
    const sessionCart = await prisma.cart.findUnique({
      where: { sessionId },
      include: { items: true },
    });

    if (!sessionCart || sessionCart.id === userCart.id) {
      const cartWithItems = await prisma.cart.findUnique({
        where: { id: userCart.id },
        include: { items: true },
      });
      return NextResponse.json(cartWithItems);
    }

    // Merge items: upsert by variant, summing quantity
    for (const item of sessionCart.items) {
      const existing = await prisma.cartItem.findUnique({
        where: { cartId_variantId: { cartId: userCart.id, variantId: item.variantId } },
      });
      if (existing) {
        await prisma.cartItem.update({
          where: { cartId_variantId: { cartId: userCart.id, variantId: item.variantId } },
          data: { quantity: existing.quantity + item.quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: userCart.id,
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            currency: item.currency,
          },
        });
      }
    }

    // Delete session cart after merge
    await prisma.cart.delete({ where: { id: sessionCart.id } }).catch(() => {});

    const merged = await prisma.cart.findUnique({
      where: { id: userCart.id },
      include: { items: true },
    });
    return NextResponse.json(merged);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


