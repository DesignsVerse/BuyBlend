import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { createCashfreeOrder, getHostedCheckoutUrl } from "@/lib/payment/cashfree"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { orderId } = body as { orderId?: string }
    if (!orderId) return NextResponse.json({ error: "orderId is required" }, { status: 400 })

    const order = await prisma.order.findUnique({ where: { id: orderId }, include: { user: true, customer: true } })
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })
    if (order.status !== "PENDING") return NextResponse.json({ error: "Order is not pending" }, { status: 400 })

    // Ensure a Payment row exists in PENDING
    let payment = await prisma.payment.findUnique({ where: { orderId: order.id } })
    if (!payment) {
      payment = await prisma.payment.create({
        data: {
          orderId: order.id,
          provider: "cashfree",
          providerIntentId: "",
          amount: order.total,
          currency: order.currency,
          status: "PENDING",
        },
      })
    }

    const scheme = process.env.NEXT_PUBLIC_APP_URL?.startsWith("https") ? "https" : undefined
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${scheme ?? "http"}://${req.headers.get("host")}`
    const returnUrl = `${baseUrl}/api/payment/return?orderId=${order.id}`
    const notifyUrl = `${baseUrl}/api/payment/webhook`

    const cfResp = await createCashfreeOrder({
      orderId: order.id,
      amount: order.total,
      currency: order.currency,
      customerEmail: order.customer?.email || order.user?.email || undefined,
      customerPhone: order.customer?.phone || undefined,
      customerName: order.customer?.name || order.user?.name || undefined,
      returnUrl,
      notifyUrl,
    })

    const hostedUrl = getHostedCheckoutUrl(cfResp)
    if (!hostedUrl) return NextResponse.json({ error: "Unable to get checkout URL" }, { status: 500 })

    await prisma.payment.update({ where: { orderId: order.id }, data: { providerIntentId: cfResp.payment_session_id ?? cfResp.order_id } })

    return NextResponse.json({ checkoutUrl: hostedUrl })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Payment init failed" }, { status: 500 })
  }
}


