import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, sessionId, currency = "USD", shipping = 0, tax = 0 } = body;

    if (!userId && !sessionId) {
      return NextResponse.json({ error: "userId or sessionId is required" }, { status: 400 });
    }
    

    // --- 1. Fetch active cart ---
    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
      include: { items: true },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    // Security layer
    if (userId && cart.userId !== userId) {
      return NextResponse.json({ error: "Cart does not belong to this user" }, { status: 403 });
    }
    if (sessionId && cart.sessionId !== sessionId) {
      return NextResponse.json({ error: "Cart does not belong to this session" }, { status: 403 });
    }

    // --- 2. Calculate totals ---
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
    const total = subtotal + shipping + tax;

    // --- 3. Create Order ---
    const order = await prisma.order.create({
      data: {
        userId: userId || null,
        cartId: cart.id,
        status: "PENDING",
        subtotal,
        tax,
        shipping,
        total,
        currency,
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
              productName: item.productName, // ✅ include name
              price: item.unitPrice,
              quantity: item.quantity,
            },
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json(order, { status: 201 });

  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
