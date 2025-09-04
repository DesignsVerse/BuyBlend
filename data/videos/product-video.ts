// products.ts
export type Product = {
    id: string
    slug: string
    title: string
    price: number
    discountPrice?: number
    image: string
    video: string
    thumbnail: string
    description: string
  }
  
  export const products: Product[] = [
    {
      id: "1",
      slug: "oxidized-studs-earrings",
      title: "Set Of 12 Oxidized Designers Studs Earrings With Folding Jewelry Box",
      price: 2499,
      discountPrice: 1999,
      image: "/images/oxidized-earrings.jpg",
      video: "/video/1.mp4",
      thumbnail: "/thumbnails/oxidized-earrings.jpg",
      description: "Beautiful set of 12 designer oxidized stud earrings with premium folding jewelry box."
    },
    {
      id: "2",
      slug: "pink-lotus-set",
      title: "Elegant Pink Lotus Necklace & Earrings Set",
      price: 3499,
      discountPrice: 2799,
      image: "/images/pink-lotus.jpg",
      video: "/video/2.mp4",
      thumbnail: "/thumbnails/pink-lotus.jpg",
      description: "Exquisite pink lotus themed necklace and earrings set for special occasions."
    },
    {
      id: "3",
      slug: "gemstone-drop-earrings",
      title: "Layers of Gemstone Drop Earrings",
      price: 1899,
      image: "/images/gemstone-earrings.jpg",
      video: "/video/3.mp4",
      thumbnail: "/thumbnails/gemstone-earrings.jpg",
      description: "Elegant gemstone drop earrings with multiple layers for a sophisticated look."
    },
    {
      id: "4",
      slug: "floral-choker-set",
      title: "Antique Floral Choker Set with Stud Earrings",
      price: 2999,
      discountPrice: 2399,
      image: "/images/floral-choker.jpg",
      video: "/video/4.mp4",
      thumbnail: "/thumbnails/floral-choker.jpg",
      description: "Vintage-inspired floral choker set with matching stud earrings."
    },
    {
      id: "5",
      slug: "floral-choker-set",
      title: "Antique Floral Choker Set with Stud Earrings",
      price: 2999,
      discountPrice: 2399,
      image: "/images/floral-choker.jpg",
      video: "/video/5.mp4",
      thumbnail: "/thumbnails/floral-choker.jpg",
      description: "Vintage-inspired floral choker set with matching stud earrings."
    }
  ]
  