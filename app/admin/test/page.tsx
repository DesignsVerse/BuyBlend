"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AdminCarts() {
  const [carts, setCarts] = useState<any[]>([])

  useEffect(() => {
    fetch("/admin/carts ")
      .then(res => res.json())
      .then(data => setCarts(data))
      .catch(err => console.error("Error fetching carts:", err))
  }, [])

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Customer Carts</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cart ID</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {carts.map(cart => (
            <TableRow key={cart.id}>
              <TableCell>{cart.id}</TableCell>
              <TableCell>{cart.userId || cart.sessionId}</TableCell>
              <TableCell>
                {cart.items.map((item: any) => (
                  <div key={item.id}>
                    {item.product?.name || "Product"} × {item.quantity}
                  </div>
                ))}
              </TableCell>
              <TableCell>
                ₹
                {cart.items.reduce(
                  (sum: number, item: any) => sum + item.quantity * item.unitPrice,
                  0
                ).toLocaleString("en-IN")}
              </TableCell>
              <TableCell>{cart.checkedOut ? "Completed" : "Active"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
