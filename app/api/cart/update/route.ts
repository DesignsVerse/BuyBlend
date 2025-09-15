import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
export async function POST(req: Request) {
    const prisma = new PrismaClient();

  try {
    const { cartId, variantId, quantity } = await req.json();

    if (!cartId || !variantId || typeof quantity !== "number") {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    if (quantity <= 0) {
      // Remove if quantity <= 0
      await prisma.cartItem.delete({
        where: {
          cartId_variantId: { cartId, variantId },
        },
      });
    } else {
      await prisma.cartItem.update({
        where: {
          cartId_variantId: { cartId, variantId },
        },
        data: { quantity },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: true },
    });

    return NextResponse.json(updatedCart);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
