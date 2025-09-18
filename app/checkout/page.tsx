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
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle, Lock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface CheckoutForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  cardNumber: string
  cardExpiry: string
  cardCvv: string
  cardName: string
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
  cardNumber: "",
  cardExpiry: "",
  cardCvv: "",
  cardName: "",
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

  const calculateTax = () => {
    return cartState.total * 0.18
  }

  const totalAmount = cartState.total + calculateShipping() + calculateTax()

  const handleProceedToShipping = () => {
    if (cartState.items.length === 0) return
    setCurrentStep(2)
  }

  const handleProceedToPayment = () => {
    if (!form.firstName || !form.lastName || !form.email || !form.address || !form.city || !form.state || !form.zipCode) {
      alert("Please fill in all required shipping fields")
      return
    }
    setCurrentStep(3)
  }

  const handlePlaceOrder = async () => {
    if (!form.cardNumber || !form.cardExpiry || !form.cardCvv || !form.cardName) {
      alert("Please fill in all payment details")
      return
    }

    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newOrderNumber = `ORD-${Date.now().toString().slice(-8)}`
    setOrderNumber(newOrderNumber)
    
    setIsProcessing(false)
    setCurrentStep(4)
    setOrderComplete(true)
    clearCart()
  }

  if (cartState.items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Add some products to your cart before checkout</p>
            <Link href="/products">
              <Button className="w-full">Continue Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-lg font-serif font-bold">BuyBlend.in</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartState.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="relative h-16 w-16 overflow-hidden rounded-md">
                        <Image
                          src={item.image || "/placeholder.svg?height=80&width=80"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">Rs. {(item.originalPrice * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>Rs. {cartState.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{calculateShipping() === 0 ? "FREE" : `Rs. ${calculateShipping().toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (GST)</span>
                      <span>Rs. {calculateTax().toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>Rs. {totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleProceedToShipping}
                    className="w-full mt-6"
                    disabled={cartState.items.length === 0}
                  >
                    Proceed to Shipping
                  </Button>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="mr-2 h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={form.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={form.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={form.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
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
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={form.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={form.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        placeholder="Enter state"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={form.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        placeholder="Enter ZIP code"
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
                  
                  <div className="flex space-x-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentStep(1)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={handleProceedToPayment}
                      className="flex-1"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 text-blue-800">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm font-medium">Secure Payment</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      Your payment information is encrypted and secure.
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="cardName">Name on Card *</Label>
                    <Input
                      id="cardName"
                      value={form.cardName}
                      onChange={(e) => handleInputChange('cardName', e.target.value)}
                      placeholder="Enter name as it appears on card"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      value={form.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cardExpiry">Expiry Date *</Label>
                      <Input
                        id="cardExpiry"
                        value={form.cardExpiry}
                        onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardCvv">CVV *</Label>
                      <Input
                        id="cardCvv"
                        value={form.cardCvv}
                        onChange={(e) => handleInputChange('cardCvv', e.target.value)}
                        placeholder="123"
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentStep(2)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="flex-1"
                    >
                      {isProcessing ? "Processing..." : `Place Order - Rs. ${totalAmount.toFixed(2)}`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 4 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">Order Confirmed!</h2>
                  <p className="text-gray-600 mb-4">Thank you for your purchase</p>
                  <Badge variant="secondary" className="mb-6">
                    Order #{orderNumber}
                  </Badge>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="font-medium mb-2">Order Summary</h3>
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
                  
                  <div className="mt-8 space-y-3">
                    <Link href="/products">
                      <Button className="w-full">Continue Shopping</Button>
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
            <div className="sticky top-8">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartState.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-md">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
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
                    <div className="flex justify-between text-sm">
                      <span>Tax (GST)</span>
                      <span>Rs. {calculateTax().toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>Rs. {totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {calculateShipping() > 0 && (
                    <div className="bg-amber-50 p-3 rounded-md border border-amber-100">
                      <p className="text-xs text-amber-800 text-center">
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
