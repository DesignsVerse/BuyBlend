import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";


export async function GET(req: Request) {

    const prisma = new PrismaClient();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const sessionId = searchParams.get("sessionId");

    let cart = null;

    if (userId) {
      cart = await prisma.cart.findUnique({
        where: { userId },
        include: { items: true },
      });
    } else if (sessionId) {
      cart = await prisma.cart.findUnique({
        where: { sessionId },
        include: { items: true },
      });
    }

    if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

    return NextResponse.json(cart);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
