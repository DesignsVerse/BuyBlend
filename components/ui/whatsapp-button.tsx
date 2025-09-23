"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WhatsAppButtonProps {
  productName: string
}

export function WhatsAppButton({ productName }: WhatsAppButtonProps) {
  const handleWhatsAppClick = () => {
    const message = `Hi! I'm interested in this combo product: ${productName}. Can you help me with custom combinations or more details?`
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <Button
      onClick={handleWhatsAppClick}
      className="w-full py-3 text-base rounded-lg bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2 font-medium"
    >
      <MessageCircle className="h-5 w-5" />
      Contact for Custom Combo
    </Button>
  )
}
