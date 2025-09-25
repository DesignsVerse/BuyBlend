import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Cashfree sends POST webhooks with event types and order/payment info
export async function POST(req: Request) {
  try {
    const payload = await req.json()
    const event = payload?.type || payload?.event || payload?.data?.event
    const orderId: string | undefined = payload?.data?.order?.order_id || payload?.order_id
    const status: string | undefined = payload?.data?.payment?.payment_status || payload?.payment_status
    const amount = Number(payload?.data?.order?.order_amount ?? payload?.order_amount ?? 0)
    const currency = payload?.data?.order?.order_currency || payload?.order_currency || "INR"
    const providerPaymentId = payload?.data?.payment?.cf_payment_id || payload?.cf_payment_id || payload?.payment_id

    if (!orderId) return NextResponse.json({ error: "orderId missing" }, { status: 400 })

    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })

    // idempotency: read payment
    let payment = await prisma.payment.findUnique({ where: { orderId } })
    if (!payment) {
      payment = await prisma.payment.create({
        data: {
          orderId,
          provider: "cashfree",
          providerIntentId: providerPaymentId ?? "",
          amount: amount || order.total,
          currency,
          status: "PENDING",
        },
      })
    }

    if (status && ["SUCCESS", "COMPLETED", "PAID"].includes(status.toUpperCase())) {
      await prisma.$transaction([
        prisma.payment.update({ where: { orderId }, data: { status: "SUCCESS", providerIntentId: providerPaymentId ?? payment.providerIntentId } }),
        prisma.order.update({ where: { id: orderId }, data: { status: "PAID" } }),
      ])
    } else if (status && ["FAILED"].includes(status.toUpperCase())) {
      await prisma.payment.update({ where: { orderId }, data: { status: "FAILED", providerIntentId: providerPaymentId ?? payment.providerIntentId } })
    } else if (status && ["PENDING"].includes(status.toUpperCase())) {
      await prisma.payment.update({ where: { orderId }, data: { status: "PENDING", providerIntentId: providerPaymentId ?? payment.providerIntentId } })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Webhook error" }, { status: 500 })
  }
}


