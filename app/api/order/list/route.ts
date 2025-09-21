import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const sessionId = searchParams.get("sessionId");

    if (!userId && !sessionId) {
      return NextResponse.json({ error: "userId or sessionId is required" }, { status: 400 });
    }

    const orders = await prisma.order.findMany({
      where: userId ? { userId } : { cart: { sessionId } },
      include: { items: true, payment: true },
      orderBy: { placedAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error listing orders:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
