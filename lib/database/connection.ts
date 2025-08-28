import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export { sql }

export async function testConnection() {
  try {
    const result = await sql`SELECT NOW() as current_time`
    console.log("[v0] Database connection successful:", result[0])
    return true
  } catch (error) {
    console.error("[v0] Database connection failed:", error)
    return false
  }
}
