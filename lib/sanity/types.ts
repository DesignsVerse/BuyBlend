export interface Product {
  _id: string
  name: string
  slug: {
    current: string
  }
  price: number
  compareAtPrice?: number
  description?: string
  images?: Array<{
    _key: string
    asset: {
      _ref: string
      _type: string
    }
    alt?: string
  }>
  category?: Category
  inventory: number
  featured: boolean
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
