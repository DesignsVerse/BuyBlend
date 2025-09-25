"use client"

import { useState } from "react"
import { useCart } from "@/lib/cart/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Truck, CheckCircle, Lock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import GiftOption from "@/components/gift/gift"

// Add custom CSS for premium animations and styling
const customStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
  .premium-button {
    background: black;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .premium-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  .sticky-header {
    position: sticky;
    top: 0;
    z-index: 10;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  @media (max-width: 640px) {
    .container {
      padding-left: 1rem;
      padding-right: 1rem;
    }
    .card {
      border-radius: 1rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }
    .input, .textarea {
      font-size: 1rem;
      padding: 0.75rem;
    }
    .button {
      font-size: 1.1rem;
      padding: 0.75rem;
    }
  }
`

interface CheckoutForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  notes: string
  saveInfo: boolean
}

const initialForm: CheckoutForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  notes: "",
  saveInfo: false,
}

export default function CheckoutPage() {
  const { state: cartState, clearCart } = useCart()
  const [form, setForm] = useState<CheckoutForm>(initialForm)
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")

  const handleInputChange = (field: keyof CheckoutForm, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const calculateShipping = () => {
    return cartState.total >= 299 ? 0 : 69
  }

  const totalAmount = cartState.total + calculateShipping()

  const handlePlaceOrder = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.address || !form.city || !form.state || !form.zipCode) {
      alert("Please fill in all required shipping fields")
      return
    }

    setIsProcessing(true)

    try {
      const orderData = {
        userId: cartState.userId || null,
        sessionId: cartState.sessionId,
        currency: "INR",
        shipping: calculateShipping(),
        tax: 0,
        customerInfo: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          notes: form.notes
        },
        items: cartState.items.map(item => ({
          productId: item.id,
          variantId: item.id,
          productName: item.name,
          quantity: item.quantity,
          unitPrice: item.originalPrice,
          currency: "INR",
          image: item.image,
          slug: item.slug
        }))
      }

      const response = await fetch('/api/order/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create order')
      }

      const order = await response.json()
      setOrderNumber(order.id || `ORD-${Date.now().toString().slice(-8)}`)

      // Initiate Cashfree payment and redirect
      const payRes = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id })
      })
      if (!payRes.ok) {
        const err = await payRes.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to initiate payment')
      }
      const { checkoutUrl } = await payRes.json()
      if (!checkoutUrl) throw new Error('Checkout URL missing')

      // Do not clear cart until webhook confirms; keep optimistic UI minimal
      setIsProcessing(false)
      window.location.href = checkoutUrl

    } catch (error) {
      console.error('Order creation failed:', error)
      alert(`Order creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setIsProcessing(false)
    }
  }

  if (cartState.items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-">
        <Card className="w-full max-w-md card animate-fade-in">
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">Add some products to your cart before checkout</p>
            <Link href="/products">
              <Button className="w-full premium-button">Continue Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{customStyles}</style>
      {/* <div className="sticky-header">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-lg font-serif font-bold">BuyBlend.in</span>
            </Link>
          </div>
         
        </div>
      </div> */}
      <div>
      <div className="flex justify-center space-x-2 mt-4">
            <div className={`h-2 w-16 rounded-full ${currentStep >= 1 ? 'bg-black' : 'bg-gray-300'}`}></div>
            <div className={`h-2 w-16 rounded-full ${currentStep >= 2 ? 'bg-black' : 'bg-gray-300'}`}></div>
          </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <Card className="card animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <Truck className="mr-2 h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={form.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Enter your first name"
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={form.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Enter your last name"
                        className="input"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter your email"
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={form.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                        className="input"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Shipping Address *</Label>
                    <Textarea
                      id="address"
                      value={form.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter your complete shipping address"
                      rows={3}
                      className="textarea"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={form.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Enter city"
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={form.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        placeholder="Enter state"
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={form.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        placeholder="Enter ZIP code"
                        className="input"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Order Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={form.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Any special instructions for delivery"
                      rows={2}
                      className="textarea"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="saveInfo"
                      checked={form.saveInfo}
                      onCheckedChange={(checked) => handleInputChange('saveInfo', checked as boolean)}
                    />
                    <Label htmlFor="saveInfo">Save this information for future orders</Label>
                  </div>

                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="w-full premium-button"
                  >
                    {isProcessing ? "Processing..." : `Place Order - Rs. ${totalAmount.toFixed(2)}`}
                  </Button>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card className="card animate-fade-in">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold mb-2">Order Confirmed!</h2>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">Thank you for your purchase</p>
                  <Badge variant="secondary" className="mb-6 text-sm">
                    Order #{orderNumber}
                  </Badge>

                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="font-medium mb-2 text-sm sm:text-base">Order Summary</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Items:</span>
                        <span>{cartState.itemCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span>Rs. {totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      We'll send you an email confirmation with tracking details.
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                      <Lock className="h-4 w-4" />
                      <span>Secure payment processed</span>
                    </div>
                  </div>

                  <div className="mt-6 sm:mt-8 space-y-3">
                    <Link href="/products">
                      <Button className="w-full premium-button">Continue Shopping</Button>
                    </Link>
                    <Link href="/">
                      <Button variant="outline" className="w-full">Back to Home</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-20 mb-4">
              <GiftOption />
            </div>

            <div className="sticky top-20">
              <Card className="card">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Order Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartState.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="relative h-12 w-12 sm:h-16 sm:w-16 overflow-hidden rounded-md">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">Rs. {(item.originalPrice * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>Rs. {cartState.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{calculateShipping() === 0 ? "FREE" : `Rs. ${calculateShipping().toFixed(2)}`}</span>
                    </div>

                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>Rs. {totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {calculateShipping() > 0 && (
                    <div className="bg-amber-50 p-3 rounded-md border border-amber-100 text-center">
                      <p className="text-xs text-amber-800">
                        Add Rs. {(299 - cartState.total).toFixed(2)} more for free shipping
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}