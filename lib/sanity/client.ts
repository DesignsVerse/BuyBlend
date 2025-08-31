import { createClient } from "@sanity/client"
import imageUrlBuilder from "@sanity/image-url"

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "demo-project"
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production"

export const client = createClient({
  projectId,
  dataset,
  useCdn: false,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
})

const builder = imageUrlBuilder(client)

export const urlFor = (source: any) => {
  if (!source) return null
  return builder.image(source)
}

// GROQ queries for ecommerce
export const queries = {
  // Get all products

    // Get all products
    allProducts: `*[_type == "product"] | order(_createdAt desc) {
      _id,
      name,
      slug,
      price,
      originalPrice,
      description,
      media[]{    // 👈 images + videos both
        _key,
        _type,
        asset,
        alt
      },
      category->{
        _id,
        name,
        slug,
        description,
        image{
          asset,
          alt
        }
      },
      inventory,
      featured,
      inStock,
      type,
      _createdAt
    }`,
  
    // Get product by slug
    productBySlug: `*[_type == "product" && slug.current == $slug][0] {
      _id,
      name,
      slug,
      price,
      originalPrice,
      description,
      media[]{
        _key,
        _type,
        asset,
        alt
      },
      category->{
        _id,
        name,
        slug,
        description,
        image{
          asset,
          alt
        }
      },
      inventory,
      featured,
      inStock,
      type,
      _createdAt
    }`,
  
    // Get all categories
    allCategories: `*[_type == "category"] | order(name asc) {
      _id,
      name,
      slug,
      description,
      image{
        asset,
        alt
      }
    }`,
  
    // Get featured products
    featuredProducts: `*[_type == "product" && featured == true] | order(_createdAt desc) {
      _id,
      name,
      slug,
      price,
      originalPrice,
      description,
      media[]{
        _key,
        _type,
        asset,
        alt
      },
      category->{
        _id,
        name,
        slug
      },
      inventory,
      featured,
      inStock,
      type,
      _createdAt
    }`,
  }  