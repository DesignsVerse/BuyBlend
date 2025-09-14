"use client"

import { customerImages } from "@/data/products/customerImages"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { ArrowLeft, ArrowRight } from "lucide-react"

export default function CustomerLove() {
  return (
    <div className="w-full py-8 relative">
      {/* Section Header */}
      <div className="flex justify-between items-center px-4 md:px-8 mb-8 max-w-[1600px] mx-auto">
        <h2 className="text-2xl font-bold text-gray-800">Customer Love</h2>
        <div className="flex gap-1">
          <button className="custom-prev bg-white border rounded-full p-2 shadow">
            <ArrowLeft size={20} />
          </button>
          <button className="custom-next bg-white border rounded-full p-2 shadow">
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Swiper */}
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        navigation={{
          prevEl: ".custom-prev",
          nextEl: ".custom-next",
        }}
        pagination={{ clickable: true, el: ".custom-pagination", type: "bullets" }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 }, // Large screens
          1600: { slidesPerView: 5 }, // Extra large screens
        }}
        className="px-4 md:px-8"
      >
        {customerImages.map((img) => (
          <SwiperSlide key={img.id}>
            <div className="relative overflow-hidden rounded-t-[50px] aspect-[3/4] flex items-center justify-center bg-gray-100">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover w-full h-full"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pagination */}
      <div className="custom-pagination mt-4 flex justify-center space-x-2"></div>
    </div>
  )
}
