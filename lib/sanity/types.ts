export interface Product {
  _id: string
  name: string
  slug: {
    current: string
  }
  price: number
  originalPrice?: number
  compareAtPrice?: number
  description?: string

  // 👇 Now supports both images & videos
  media?: Array<
    | {
        _key: string
        _type: "image"
        asset: {
          _ref: string
          _type: string
        }
        alt?: string
      }
    | {
        _key: string
        _type: "file"
        asset: {
          _ref: string
          _type: string
        }
      }
  >

  category?: Category
  inventory: number
  inStock?: boolean
  featured: boolean
  type?: string
  tags?: string[]
  variants?: Array<{
    name: string
    value: string
    price?: number
    inventory?: number
  }>
  _createdAt: string
}

export interface Category {
  _id: string
  name: string
  slug: {
    current: string
  }
  description?: string
  image?: {
    asset: {
      _ref: string
      _type: string
    }
    alt?: string
  }
}
