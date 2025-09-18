import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cartId, variantId, quantity, userId, sessionId, unitPrice, currency } = body || {};

    // Coerce quantity to number
    const qty = typeof quantity === "string" ? Number(quantity) : quantity;

    // Resolve cartId if not provided
    let resolvedCartId = cartId as string | undefined;
    if (!resolvedCartId) {
      if (!userId && !sessionId) {
        return NextResponse.json({ error: "Missing cartId or userId/sessionId" }, { status: 400 });
      }
      const cart =
        userId
          ? await prisma.cart.findUnique({ where: { userId } })
          : await prisma.cart.findUnique({ where: { sessionId } });
      if (!cart) {
        return NextResponse.json({ error: "Cart not found" }, { status: 404 });
      }
      resolvedCartId = cart.id;
    }

    if (!resolvedCartId || !variantId || typeof qty !== "number" || Number.isNaN(qty)) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    if (qty <= 0) {
      await prisma.cartItem.delete({
        where: { cartId_variantId: { cartId: resolvedCartId, variantId } },
      }).catch(() => {});
    } else {
      // Update if exists else create with provided pricing
      const existing = await prisma.cartItem.findUnique({
        where: { cartId_variantId: { cartId: resolvedCartId, variantId } },
      });
      if (existing) {
        await prisma.cartItem.update({
          where: { cartId_variantId: { cartId: resolvedCartId, variantId } },
          data: { quantity: qty },
        });
      } else {
        if (typeof unitPrice !== "number" || Number.isNaN(unitPrice)) {
          return NextResponse.json({ error: "Missing unitPrice for new item" }, { status: 400 });
        }
        await prisma.cartItem.create({
          data: {
            cartId: resolvedCartId,
            productId: variantId,
            variantId,
            quantity: qty,
            unitPrice,
            currency: currency || "INR",
          },
        });
      }
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: resolvedCartId },
      include: { items: true },
    });
    return NextResponse.json(updatedCart);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
