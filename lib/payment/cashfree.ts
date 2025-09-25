import type { NextRequest } from "next/server"

type CashfreeEnv = "sandbox" | "production"

const CASHFREE_BASE_BY_ENV: Record<CashfreeEnv, string> = {
  sandbox: "https://sandbox.cashfree.com/pg",
  production: "https://api.cashfree.com/pg",
}

export interface CreateCashfreeOrderInput {
  orderId: string
  amount: number
  currency: string
  customerPhone?: string
  customerEmail?: string
  customerName?: string
  returnUrl: string
  notifyUrl?: string
}

export interface CreateCashfreeOrderResponse {
  order_id: string
  payment_session_id?: string
  payment_link?: string
}

function getConfig() {
  const env = (process.env.CASHFREE_ENV as CashfreeEnv) || "sandbox"
  const clientId = process.env.CASHFREE_CLIENT_ID
  const clientSecret = process.env.CASHFREE_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    throw new Error("Cashfree credentials not configured")
  }
  const baseUrl = CASHFREE_BASE_BY_ENV[env]
  return { env, clientId, clientSecret, baseUrl }
}

export async function createCashfreeOrder(input: CreateCashfreeOrderInput): Promise<CreateCashfreeOrderResponse> {
  const { clientId, clientSecret, baseUrl } = getConfig()

  const body = {
    order_id: input.orderId,
    order_amount: Number(input.amount.toFixed(2)),
    order_currency: input.currency,
    customer_details: {
      customer_id: input.customerEmail || input.customerPhone || input.customerName || input.orderId,
      customer_phone: input.customerPhone,
      customer_email: input.customerEmail,
      customer_name: input.customerName,
    },
    order_meta: {
      return_url: input.returnUrl,
      notify_url: input.notifyUrl,
    },
  }

  const res = await fetch(`${baseUrl}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-id": clientId,
      "x-client-secret": clientSecret,
      "x-api-version": "2022-09-01",
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Cashfree order create failed: ${res.status} ${text}`)
  }

  const json = (await res.json()) as any
  return {
    order_id: json?.order_id,
    payment_session_id: json?.payment_session_id,
    payment_link: json?.payment_link,
  }
}

export function getHostedCheckoutUrl(resp: CreateCashfreeOrderResponse): string | null {
  if (resp.payment_link) return resp.payment_link
  if (resp.payment_session_id) {
    // Fallback hosted checkout using session id (Cashfree Drop-in/Checkout SDK is recommended for SPA)
    return `https://payments.cashfree.com/order/#${resp.payment_session_id}`
  }
  return null
}


