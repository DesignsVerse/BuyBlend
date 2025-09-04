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
    <div className="max-w-6xl mx-auto py- px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Customer Love</h2>
        <div className="flex gap-2">
          <button className="custom-prev bg-white border rounded-full p-2 shadow">
            <ArrowLeft size={20} />
          </button>
          <button className="custom-next bg-white border rounded-full p-2 shadow">
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={3}
        loop={true}
        navigation={{
          prevEl: ".custom-prev",
          nextEl: ".custom-next",
        }}
        pagination={{ clickable: true, el: ".custom-pagination", type: "bullets" }}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {customerImages.map((img) => (
          <SwiperSlide key={img.id}>
            <div className="relative overflow-hidden rounded-t-[50px] aspect-[3/4] flex items-center justify-center bg-gray-100">
              <Image
                src={img.src}
                alt={img.alt}
                width={300}
                height={400}
                className="object-cover w-full h-full"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="custom-pagination mt-4 flex justify-center space-x-2"></div>
    </div>
  )
}