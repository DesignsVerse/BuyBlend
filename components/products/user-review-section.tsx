"use client"

import { useState } from "react"
import { Star, Camera, Award, Sparkles, CheckCircle, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReviewSection({ productName }: { productName: string }) {
  const [rating, setRating] = useState<number>(0)
  const [hover, setHover] = useState<number>(0)
  const [review, setReview] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [files, setFiles] = useState<FileList | null>(null)
  const [saveInfo, setSaveInfo] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rating || !review || !name || !email) {
      alert("Please fill all required fields.")
      return
    }
    
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log({
      rating,
      review,
      name,
      email,
      files,
      saveInfo,
    })
    
    setIsSubmitting(false)
    setIsExpanded(false) // Collapse after submission
    alert("✅ Review submitted successfully! Your coupon will be emailed shortly.")
  }

  return (
    <Card className="shadow-lg border border-gray-200 rounded-xl bg-white overflow-hidden">
      {/* Compact View */}
      {!isExpanded ? (
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <Award className="w-10 h-10 text-amber-500 mb-3" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Share Your Experience
            </h3>
            <p className="text-gray-600 mb-4">
              Be the first to review <span className="font-medium">"{productName}"</span> and get an exclusive coupon!
            </p>
            <Button 
              onClick={() => setIsExpanded(true)}
              className="bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 text-white font-semibold rounded-lg px-6 py-3 transition-all duration-300"
            >
              <Star className="w-4 h-4 mr-2" />
              Write a Review
            </Button>
          </div>
        </CardContent>
      ) : (
        /* Expanded View */
        <>
          <CardHeader className="bg-gradient-to-r from-gray-900 to-black text-white py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-amber-400" />
                <CardTitle className="text-xl font-bold">
                  Review "{productName}"
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="text-white hover:bg-white/10 rounded-full p-1"
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-gray-200 text-sm flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Get an exclusive coupon for your review!
            </p>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating Section */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <Label className="block text-sm font-semibold text-gray-900 mb-3">
                  How would you rate this product? *
                </Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="transform transition-all duration-200 hover:scale-110"
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setRating(star)}
                    >
                      <Star
                        className={`w-8 h-8 transition-all duration-200 ${
                          (hover || rating) >= star
                            ? "text-amber-500 fill-amber-500"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {rating ? (
                    <span className="flex items-center gap-1 text-amber-600 font-medium">
                      <CheckCircle className="w-3 h-3" />
                      {rating} star{rating > 1 ? 's' : ''} selected
                    </span>
                  ) : (
                    "Click on a star to rate"
                  )}
                </div>
              </div>

              {/* Review Section */}
              <div className="space-y-3">
                <Label htmlFor="review" className="block text-sm font-semibold text-gray-900">
                  Share your experience *
                </Label>
                <Textarea
                  id="review"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Tell us what you loved about this product..."
                  required
                  className="min-h-[120px] p-3 text-base border border-gray-300 focus:border-gray-400 rounded-lg resize-none transition-all"
                />
                <p className="text-xs text-gray-500">
                  {review.length}/500 characters
                </p>
              </div>

              {/* Image Upload */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <Label className="block text-sm font-semibold text-gray-900 mb-3">
                  <Camera className="w-4 h-4 inline mr-1 text-gray-600" />
                  Add photos (optional)
                </Label>
                <div className="flex items-center gap-3">
                  <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                    <Camera className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">Add photos</span>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => setFiles(e.target.files)}
                    />
                  </label>
                  {files && (
                    <div className="text-xs text-gray-600">
                      <p>{files.length} file{files.length > 1 ? 's' : ''} selected</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Personal Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                    Your Name *
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Full name"
                    className="h-12 text-base border border-gray-300 focus:border-gray-400 rounded-lg px-3 transition-all"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your.email@example.com"
                    className="h-12 text-base border border-gray-300 focus:border-gray-400 rounded-lg px-3 transition-all"
                  />
                </div>
              </div>

              {/* Save Info */}
              <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <input
                  type="checkbox"
                  id="saveInfo"
                  checked={saveInfo}
                  onChange={(e) => setSaveInfo(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                />
                <Label htmlFor="saveInfo" className="text-xs text-gray-700 leading-relaxed">
                  Save my information for future reviews
                </Label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsExpanded(false)}
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 text-white font-semibold rounded-lg transition-all"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Submit Review
                    </div>
                  )}
                </Button>
              </div>

              {/* Privacy Note */}
              <p className="text-xs text-gray-500 text-center">
                Your review helps other shoppers. By submitting, you agree to our terms.
              </p>
            </form>
          </CardContent>
        </>
      )}
      
    </Card>
  )
}