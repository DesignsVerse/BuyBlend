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
      try {
        cart = await prisma.cart.upsert({
          where: { userId },
          update: {},
          create: { userId },
        });
      } catch (e: any) {
        if (e?.code === 'P2002') {
          cart = await prisma.cart.findUnique({ where: { userId } });
        } else {
          throw e;
        }
      }
    } else if (sessionId) {
      try {
        cart = await prisma.cart.upsert({
          where: { sessionId },
          update: {},
          create: { sessionId },
        });
      } catch (e: any) {
        // Handle potential race condition where two concurrent requests try to create the same session cart
        if (e?.code === 'P2002') {
          cart = await prisma.cart.findUnique({ where: { sessionId } });
        } else {
          throw e;
        }
      }
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
