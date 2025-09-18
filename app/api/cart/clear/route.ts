import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Clear all items in a cart by cartId or by userId/sessionId
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cartId, userId, sessionId } = body || {};

    // Resolve cartId if not provided
    let resolvedCartId = cartId as string | undefined;
    if (!resolvedCartId) {
      if (!userId && !sessionId) {
        return NextResponse.json({ error: "Missing cartId or userId/sessionId" }, { status: 400 });
      }
      const cart = userId
        ? await prisma.cart.findUnique({ where: { userId } })
        : await prisma.cart.findUnique({ where: { sessionId } });
      if (!cart) {
        return NextResponse.json({ message: "Cart already empty" });
      }
      resolvedCartId = cart.id;
    }

    // Delete all items for this cart
    await prisma.cartItem.deleteMany({ where: { cartId: resolvedCartId } });

    const cleared = await prisma.cart.findUnique({
      where: { id: resolvedCartId },
      include: { items: true },
    });

    return NextResponse.json(cleared);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


