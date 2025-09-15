import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
export async function POST(req: Request) {
    const prisma = new PrismaClient();

  try {
    const { cartId, variantId } = await req.json();

    if (!cartId || !variantId) {
      return NextResponse.json({ error: "Missing cartId or variantId" }, { status: 400 });
    }

    await prisma.cartItem.delete({
      where: {
        cartId_variantId: { cartId, variantId },
      },
    });

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
