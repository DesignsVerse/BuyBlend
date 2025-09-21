import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function POST(req: Request) {
  try {
    const { userId, cartId } = await req.json();

    if (!cartId || !userId) {
      return NextResponse.json({ error: "Missing userId or cartId" }, { status: 400 });
    }

    // Fetch cart with items
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: true },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const tax = subtotal * 0.1; // 10% tax (example)
    const shipping = 50; // flat shipping (example)
    const total = subtotal + tax + shipping;

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        cartId,
        status: "PENDING",
        subtotal,
        tax,
        shipping,
        total,
        currency: "USD",
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            currency: item.currency,
            snapshot: {
              productId: item.productId,
              variantId: item.variantId,
              unitPrice: item.unitPrice,
            },
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json(order);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
