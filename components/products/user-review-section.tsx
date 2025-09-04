"use client"

import { useState } from "react"
import { Star, Camera, Award, Sparkles, CheckCircle } from "lucide-react"
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
    alert("✅ Review submitted successfully! Your coupon will be emailed shortly.")
  }

  return (
    <Card className="shadow-2xl border-0 rounded-2xl bg-gradient-to-br from-white to-gray-50 overflow-hidden">
      {/* Premium Header */}
      <CardHeader className="bg-gradient-to-r from-gray-900 to-black text-white py-6">
        <div className="flex items-center gap-3 mb-2">
          <Award className="w-6 h-6 text-amber-400" />
          <CardTitle className="text-2xl font-bold">
            Share Your Experience
          </CardTitle>
        </div>
        <p className="text-gray-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Review <span className="font-semibold italic">"{productName}"</span> and get an exclusive coupon!
        </p>
      </CardHeader>
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Rating Section */}
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
            <Label className="block text-lg font-semibold text-gray-900 mb-4">
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
                    className={`w-10 h-10 transition-all duration-200 ${
                      (hover || rating) >= star
                        ? "text-amber-500 fill-amber-500 drop-shadow-lg"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="mt-3 text-sm text-gray-600">
              {rating ? (
                <span className="flex items-center gap-2 text-amber-600 font-medium">
                  <CheckCircle className="w-4 h-4" />
                  {rating} star{rating > 1 ? 's' : ''} selected
                </span>
              ) : (
                "Click on a star to rate"
              )}
            </div>
          </div>

          {/* Review Section */}
          <div className="space-y-4">
            <Label htmlFor="review" className="block text-lg font-semibold text-gray-900">
              Share your experience *
            </Label>
            <Textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Tell us what you loved about this product, how you use it, or any suggestions for improvement..."
              required
              className="min-h-[150px] p-4 text-lg border-2 border-gray-200 focus:border-gray-400 rounded-xl resize-none transition-all"
            />
            <p className="text-sm text-gray-500">
              {review.length}/500 characters • Be detailed and honest
            </p>
          </div>

          {/* Image Upload */}
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
            <Label className="block text-lg font-semibold text-gray-900 mb-4">
              <Camera className="w-5 h-5 inline mr-2 text-gray-600" />
              Add photos to your review
            </Label>
            <div className="flex items-center gap-4">
              <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-gray-400 transition-colors">
                <Camera className="w-8 h-8 text-gray-400 mb-1" />
                <span className="text-sm text-gray-500">Add photos</span>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 2) {
                      alert("Maximum 2 files allowed.")
                      e.target.value = ""
                      return
                    }
                    if (e.target.files) {
                      const totalSize = Array.from(e.target.files).reduce((acc, file) => acc + file.size, 0)
                      if (totalSize > 2 * 1024 * 1024) {
                        alert("Total size must be less than 2MB.")
                        e.target.value = ""
                        return
                      }
                    }
                    setFiles(e.target.files)
                  }}
                />
              </label>
              {files && (
                <div className="text-sm text-gray-600">
                  <p>{files.length} file{files.length > 1 ? 's' : ''} selected</p>
                  <p className="text-xs text-gray-500">Max 2MB total</p>
                </div>
              )}
            </div>
          </div>

          {/* Personal Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name" className="block text-lg font-semibold text-gray-900 mb-3">
                Your Name *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your full name"
                className="h-14 text-lg border-2 border-gray-200 focus:border-gray-400 rounded-xl px-4 transition-all"
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="block text-lg font-semibold text-gray-900 mb-3">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your.email@example.com"
                className="h-14 text-lg border-2 border-gray-200 focus:border-gray-400 rounded-xl px-4 transition-all"
              />
            </div>
          </div>

          {/* Save Info */}
          <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <input
              type="checkbox"
              id="saveInfo"
              checked={saveInfo}
              onChange={(e) => setSaveInfo(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
            />
            <Label htmlFor="saveInfo" className="text-sm text-gray-700 leading-relaxed">
              Save my name and email for future reviews. Your information will only be used to personalize your experience and send your coupon.
            </Label>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full h-16 bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting Review...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Submit Review & Get Coupon
              </div>
            )}
          </Button>

          {/* Privacy Note */}
          <p className="text-xs text-gray-500 text-center">
            Your review helps other shoppers. By submitting, you agree to our terms and privacy policy.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}