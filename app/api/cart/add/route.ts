import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";


export async function POST(req: Request) {
    const prisma = new PrismaClient();

  try {
    const { userId, sessionId, productId, variantId, quantity, unitPrice, currency } = await req.json();

    if (!productId || !variantId || !quantity || !unitPrice || !currency) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Find or create cart
    let cart = null;
    if (userId) {
      cart = await prisma.cart.upsert({
        where: { userId },
        update: {},
        create: { userId },
      });
    } else if (sessionId) {
      cart = await prisma.cart.upsert({
        where: { sessionId },
        update: {},
        create: { sessionId },
      });
    }

    if (!cart) return NextResponse.json({ error: "Cart not found or created" }, { status: 404 });

    // Check if item already exists
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_variantId: { cartId: cart.id, variantId },
      },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { cartId_variantId: { cartId: cart.id, variantId } },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId,
          quantity,
          unitPrice,
          currency,
        },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: true },
    });

    return NextResponse.json(updatedCart);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
