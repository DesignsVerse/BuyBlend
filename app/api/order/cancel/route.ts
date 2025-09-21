import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const canceled = await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELED" },
      include: { items: true },
    });

    return NextResponse.json(canceled);
  } catch (error) {
    console.error("Error canceling order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
