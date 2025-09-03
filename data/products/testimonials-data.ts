// lib/data/testimonials-data.ts
export interface Testimonial {
    id: number
    name: string
    role: string
    message: string
    image: string
    rating?: number
  }
  
  export const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Aarav Mehta",
      role: "Verified Buyer",
      message: "Absolutely loved the jewelry quality! It was even better than I expected.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: "Happy Customer",
      message: "The delivery was quick and the packaging felt luxurious. Highly recommend!",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      rating: 4,
    },
    {
      id: 3,
      name: "Rahul Verma",
      role: "Long-term Client",
      message: "Amazing craftsmanship. I have purchased multiple times and never been disappointed.",
      image: "https://randomuser.me/api/portraits/men/12.jpg",
      rating: 5,
    },
  ]
  