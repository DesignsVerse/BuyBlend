import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      userId, 
      sessionId, 
      currency = "INR", 
      shipping = 0, 
      tax = 0,
      customerInfo,
      items
    } = body;

    if (!userId && !sessionId) {
      return NextResponse.json({ error: "userId or sessionId is required" }, { status: 400 });
    }

    // --- 1. Create or find customer if customerInfo is provided ---
    let customerId = null;
    if (customerInfo) {
      // First try to find existing customer by email
      let customer = await prisma.customer.findFirst({
        where: { email: customerInfo.email }
      });

      if (customer) {
        // Update existing customer
        customer = await prisma.customer.update({
          where: { id: customer.id },
          data: {
            name: `${customerInfo.firstName} ${customerInfo.lastName}`,
            phone: customerInfo.phone,
            address: customerInfo.address,
            city: customerInfo.city,
            state: customerInfo.state,
            postal: customerInfo.zipCode,
          },
        });
      } else {
        // Create new customer
        customer = await prisma.customer.create({
          data: {
            userId: userId || null,
            name: `${customerInfo.firstName} ${customerInfo.lastName}`,
            email: customerInfo.email,
            phone: customerInfo.phone,
            address: customerInfo.address,
            city: customerInfo.city,
            state: customerInfo.state,
            postal: customerInfo.zipCode,
          },
        });
      }
      customerId = customer.id;
    }

    // --- 2. Calculate totals from items ---
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.unitPrice * item.quantity,
      0
    );
    const total = subtotal + shipping + tax;

    // --- 3. Create Order ---
    console.log("Creating order with items:", items);
    
    const order = await prisma.order.create({
      data: {
        userId: userId || null,
        customerId: customerId,
        cartId: null, // We're not using cart for this flow
        status: "PENDING",
        subtotal,
        tax,
        shipping,
        total,
        currency,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            variantId: item.variantId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            currency: item.currency,
            snapshot: {
              productId: item.productId,
              variantId: item.variantId,
              productName: item.productName,
              price: item.unitPrice,
              quantity: item.quantity,
              image: item.image,
              slug: item.slug,
            },
          })),
        },
      },
      include: { items: true },
    });

    // Create pending payment row
    await prisma.payment.upsert({
      where: { orderId: order.id },
      create: {
        orderId: order.id,
        provider: "cashfree",
        providerIntentId: "",
        amount: order.total,
        currency: order.currency,
        status: "PENDING",
      },
      update: {
        amount: order.total,
        currency: order.currency,
        status: "PENDING",
      },
    })

    return NextResponse.json(order, { status: 201 });

  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
