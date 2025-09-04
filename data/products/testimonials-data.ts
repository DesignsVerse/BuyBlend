export interface ProductTestimonial {
    id: string
    productId: string   // slug
    name: string
    role: string
    message: string
    image: string
    rating: number
  }
  
  // Dummy data helpers
  const names = [
    "Aarav Mehta", "Priya Sharma", "Rohan Verma", "Neha Kapoor",
    "Arjun Patel", "Simran Kaur", "Kabir Singh", "Ananya Gupta",
    "Ishaan Joshi", "Meera Reddy", "Vikram Nair", "Tanya Desai",
    "Kunal Bhatia", "Sanya Malhotra", "Dev Khanna", "Ritika Jain",
    "Aditya Rao", "Pooja Iyer", "Nikhil Chauhan", "Shruti Mishra",
    "Rahul Sinha", "Sneha Chatterjee", "Manav Kapoor", "Alisha Shah"
  ]
  
  const roles = ["Verified Buyer", "Happy Customer", "Client", "Frequent Buyer"]
  
  const messages = [
    "Amazing quality, looks stunning in real life!",
    "Fast delivery and premium packaging. Loved it!",
    "Sparkles so beautifully, perfect for gifting.",
    "Worth every rupee, highly recommended.",
    "The design is elegant and classy.",
    "Exactly as shown in the pictures, very happy!",
    "Customer support was very helpful.",
    "Definitely buying again from here!",
    "Feels premium and lightweight to wear.",
    "Matched perfectly with my outfit!"
  ]
  
  const getImage = (i: number) =>
    `https://randomuser.me/api/portraits/${i % 2 === 0 ? "men" : "women"}/${(i % 99) + 1}.jpg`
  
  // 👉 Har product ke liye unique names + unique messages
  function generateTestimonialsForProduct(slug: string, count = 6): ProductTestimonial[] {
    const shuffledNames = [...names].sort(() => 0.5 - Math.random()).slice(0, count)
    const shuffledMessages = [...messages].sort(() => 0.5 - Math.random()).slice(0, count)
  
    return Array.from({ length: count }, (_, i) => ({
      id: `${slug}-${i + 1}`,
      productId: slug,
      name: shuffledNames[i],      // ✅ unique name
      role: roles[Math.floor(Math.random() * roles.length)],
      message: shuffledMessages[i], // ✅ unique message
      image: getImage(i),
      rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 star
    }))
  }
  
  // ✅ Product Slugs
  const productSlugs = [
    "classic-gold-drop-pendant",
    "silver-petal-pearl-pendant",
    "golden-motif-link-pendant",
    "radiant-gold-bow-pendant",
    "pearl-cluster-grace-earrings",
    "luxe-linear-gold-drops",
    "golden-starburst-studs",
    "crystal-blossom-pearl-drops",
    "sculpted-aura-gold-studs",
    "marble-luxe-geometric-earrings",
    "luxe-cascading-pearl-drops",
    "midnight-butterfly-pearl-drops",
    "bow-accent-pearl-drops",
    "crystal-wing-drop-earrings",
    "cherry-delight-drops",
    "blush-rose-pearl-studs",
    "golden-monarch-studs",
    "lavender-loop-hoops",
    "antitarnish-bow-pendant",
    "small-butterfly-earrings",
    "butterfly-golden-earrings",
    "heart-shape-korean-earrings-3pcs",
    "korean-earrings-2",
    "long-butterfly-earring",
    "butterfly-combo-earrings",
    "antitarnish-pendant",
    "combo-earrings-card-1",
    "combo-earrings-card-2",
    "combo-earring-set-1",
  ]
  
  // ✅ Final Export
  export const productTestimonials: Record<string, ProductTestimonial[]> = (() => {
    const result: Record<string, ProductTestimonial[]> = {}
    productSlugs.forEach((slug) => {
      result[slug] = generateTestimonialsForProduct(slug, 6)
    })
    return result
  })()
  