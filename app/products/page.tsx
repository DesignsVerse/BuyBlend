"use client"

import { Suspense, useEffect, useMemo, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { client, queries } from "@/lib/sanity/client"
import type { Product, Category } from "@/lib/sanity/types"
import { mockProducts, mockCategories } from "@/lib/sanity/mock-data"
import { ProductCard } from "@/components/Home/product-card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Client-rendered page to allow dynamic filters without full reload
// Fetch helpers wrapped for client usage (Next supports client fetch for Sanity)

type ProductFiltersState = {
  q: string
  categories: string[]
  minPrice?: number
  maxPrice?: number
  inStock: boolean
  featured: boolean
  sort: "newest" | "price_asc" | "price_desc"
  page: number
  perPage: number | "all"
}

const DEFAULT_PER_PAGE = 12
const PRICE_RANGE_DEFAULT: [number, number] = [0, 2000]

async function fetchCategories(): Promise<Category[]> {
  try {
    const categories = await client.fetch<Category[]>(queries.allCategories)
    return categories && categories.length > 0 ? categories : (mockCategories as unknown as Category[])
  } catch {
    return mockCategories as unknown as Category[]
  }
}

function buildQueryAndParams(filters: ProductFiltersState) {
  const params: Record<string, unknown> = {}
  const conditions: string[] = ["_type == 'product'"]

  if (filters.q && filters.q.trim()) {
    params.q = `${filters.q.trim()}*`
    conditions.push("name match $q || description match $q")
  }

  if (filters.categories.length > 0) {
    params.catSlugs = filters.categories
    conditions.push("category->slug.current in $catSlugs")
  }

  if (typeof filters.minPrice === "number") {
    params.minPrice = filters.minPrice
    conditions.push("price >= $minPrice")
  }

  if (typeof filters.maxPrice === "number") {
    params.maxPrice = filters.maxPrice
    conditions.push("price <= $maxPrice")
  }

  if (filters.inStock) {
    conditions.push("inventory > 0")
  }

  if (filters.featured) {
    conditions.push("featured == true")
  }

  let order = "_createdAt desc"
  if (filters.sort === "price_asc") order = "price asc"
  if (filters.sort === "price_desc") order = "price desc"

  const baseProjection = `{
    _id,
    name,
    slug,
    price,
    compareAtPrice,
    description,
    images,
    category->{ _id, name, slug },
    inventory,
    featured,
    tags,
    _createdAt
  }`

  const where = conditions.length ? `*[${conditions.join(" && ")}]` : "*[_type=='product']"

  const useSlice = filters.perPage !== "all"
  const perPage = typeof filters.perPage === "number" ? filters.perPage : DEFAULT_PER_PAGE
  const start = (filters.page - 1) * perPage
  const end = start + perPage

  const queryForPage = useSlice
    ? `${where} | order(${order}) ${baseProjection}[$start...$end]`
    : `${where} | order(${order}) ${baseProjection}`
  const queryForCount = `count(${where})`

  return { queryForPage, queryForCount, params: useSlice ? { ...params, start, end } : params }
}

async function fetchProductsWithCount(filters: ProductFiltersState) {
  try {
    const { queryForPage, queryForCount, params } = buildQueryAndParams(filters)
    const [items, total] = await Promise.all([
      client.fetch<Product[]>(queryForPage, params),
      client.fetch<number>(queryForCount, params),
    ])

    // Fallback to mock if Sanity has no products
    if (!items || items.length === 0) {
      let data = [...mockProducts] as Product[]

      // Apply filters on mock locally
      if (filters.q && filters.q.trim()) {
        const q = filters.q.trim().toLowerCase()
        data = data.filter((p) => p.name.toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q))
      }
      if (filters.categories.length > 0) {
        const set = new Set(filters.categories)
        data = data.filter((p) => p.category && set.has(p.category.slug.current))
      }
      if (typeof filters.minPrice === "number") data = data.filter((p) => p.price >= (filters.minPrice as number))
      if (typeof filters.maxPrice === "number") data = data.filter((p) => p.price <= (filters.maxPrice as number))
      if (filters.inStock) data = data.filter((p) => (p.inventory || 0) > 0)
      if (filters.featured) data = data.filter((p) => p.featured)

      if (filters.sort === "price_asc") data.sort((a, b) => a.price - b.price)
      else if (filters.sort === "price_desc") data.sort((a, b) => b.price - a.price)
      else data.sort((a, b) => new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime())

      const totalLocal = data.length
      if (filters.perPage === "all") {
        return { items: data, total: totalLocal }
      }
      const per = typeof filters.perPage === "number" ? filters.perPage : DEFAULT_PER_PAGE
      const start = (filters.page - 1) * per
      const end = start + per
      return { items: data.slice(start, end), total: totalLocal }
    }

    return { items, total }
  } catch {
    // On error, fallback to mock as well
    let data = [...mockProducts] as Product[]
    if (filters.q && filters.q.trim()) {
      const q = filters.q.trim().toLowerCase()
      data = data.filter((p) => p.name.toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q))
    }
    if (filters.categories.length > 0) {
      const set = new Set(filters.categories)
      data = data.filter((p) => p.category && set.has(p.category.slug.current))
    }
    if (typeof filters.minPrice === "number") data = data.filter((p) => p.price >= (filters.minPrice as number))
    if (typeof filters.maxPrice === "number") data = data.filter((p) => p.price <= (filters.maxPrice as number))
    if (filters.inStock) data = data.filter((p) => (p.inventory || 0) > 0)
    if (filters.featured) data = data.filter((p) => p.featured)

    if (filters.sort === "price_asc") data.sort((a, b) => a.price - b.price)
    else if (filters.sort === "price_desc") data.sort((a, b) => b.price - a.price)
    else data.sort((a, b) => new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime())

    const totalLocal = data.length
    if (filters.perPage === "all") {
      return { items: data, total: totalLocal }
    }
    const per = typeof filters.perPage === "number" ? filters.perPage : DEFAULT_PER_PAGE
    const start = (filters.page - 1) * per
    const end = start + per
    return { items: data.slice(start, end), total: totalLocal }
  }
}

function useURLFilters(): [ProductFiltersState, (next: Partial<ProductFiltersState>) => void] {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const state = useMemo<ProductFiltersState>(() => {
    const q = searchParams.get("q") || ""
    const categories = (searchParams.get("category") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
    const minPrice = searchParams.get("min")
    const maxPrice = searchParams.get("max")
    const inStock = searchParams.get("stock") === "1"
    const featured = searchParams.get("feat") === "1"
    const sort = (searchParams.get("sort") as ProductFiltersState["sort"]) || "newest"
    const page = Number(searchParams.get("page") || "1") || 1
    const perRaw = searchParams.get("per") || "all"
    const perPage = perRaw === "all" ? "all" : (Number(perRaw) || DEFAULT_PER_PAGE)
    return {
      q,
      categories,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      inStock,
      featured,
      sort,
      page,
      perPage,
    }
  }, [searchParams])

  function update(next: Partial<ProductFiltersState>) {
    const params = new URLSearchParams(searchParams.toString())

    const merged: ProductFiltersState = {
      ...state,
      ...next,
      page: typeof next.page === "number" ? next.page : 1,
    }

    params.set("page", String(merged.page))
    if (merged.q) params.set("q", merged.q); else params.delete("q")
    if (merged.categories.length > 0) params.set("category", merged.categories.join(",")); else params.delete("category")
    if (typeof merged.minPrice === "number") params.set("min", String(merged.minPrice)); else params.delete("min")
    if (typeof merged.maxPrice === "number") params.set("max", String(merged.maxPrice)); else params.delete("max")
    if (merged.inStock) params.set("stock", "1"); else params.delete("stock")
    if (merged.featured) params.set("feat", "1"); else params.delete("feat")
    if (merged.sort && merged.sort !== "newest") params.set("sort", merged.sort); else params.delete("sort")
    if (merged.perPage === "all") params.set("per", "all"); else params.set("per", String(merged.perPage))

    router.replace(`${pathname}?${params.toString()}`)
  }

  return [state, update]
}

function useProductsData(filters: ProductFiltersState) {
  const [data, setData] = useState<{ items: Product[]; total: number } | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    let mounted = true
    startTransition(() => {
      fetchProductsWithCount(filters)
        .then((res) => {
          if (mounted) setData(res)
        })
        .catch(() => {
          if (mounted) setData({ items: [], total: 0 })
        })
    })
    return () => {
      mounted = false
    }
  }, [filters.q, filters.categories.join(","), filters.minPrice, filters.maxPrice, filters.inStock, filters.featured, filters.sort, filters.page, filters.perPage])

  return { data, isPending }
}

function useAllCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  useEffect(() => {
    let mounted = true
    fetchCategories()
      .then((res) => { if (mounted) setCategories(res) })
      .catch(() => { if (mounted) setCategories(mockCategories as unknown as Category[]) })
    return () => { mounted = false }
  }, [])
  return categories
}

function ProductsPageInner() {
  const [filters, setFilters] = useURLFilters()
  const { data, isPending } = useProductsData(filters)
  const categories = useAllCategories()

  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.minPrice ?? PRICE_RANGE_DEFAULT[0],
    filters.maxPrice ?? PRICE_RANGE_DEFAULT[1],
  ])

  useEffect(() => {
    setPriceRange([
      filters.minPrice ?? PRICE_RANGE_DEFAULT[0],
      filters.maxPrice ?? PRICE_RANGE_DEFAULT[1],
    ])
  }, [filters.minPrice, filters.maxPrice])

  const total = data?.total ?? 0
  const perPage = filters.perPage === "all" ? (total || DEFAULT_PER_PAGE) : filters.perPage
  const totalPages = filters.perPage === "all" ? 1 : Math.max(1, Math.ceil(total / (typeof perPage === "number" ? perPage : DEFAULT_PER_PAGE)))
  const items = data?.items ?? []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-gray-600">Explore our curated collection</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            {filters.q && <Badge variant="secondary">Search: {filters.q}</Badge>}
            {filters.categories.map((c) => (
              <Badge key={c} variant="outline" className="capitalize">{c.replaceAll("-", " ")}</Badge>
            ))}
            {typeof filters.minPrice === "number" || typeof filters.maxPrice === "number" ? (
              <Badge variant="secondary">Price: ${filters.minPrice ?? PRICE_RANGE_DEFAULT[0]} - ${filters.maxPrice ?? PRICE_RANGE_DEFAULT[1]}</Badge>
            ) : null}
            {filters.inStock && <Badge variant="secondary">In Stock</Badge>}
            {filters.featured && <Badge variant="secondary">Featured</Badge>}
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-600">Show</Label>
            <Select value={String(filters.perPage)} onValueChange={(v) => {
              const nextPer = v === "all" ? "all" : Number(v)
              setFilters({ perPage: nextPer, page: 1 })
            }}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="48">48</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="md:col-span-3 lg:col-span-3">
          <Card className="p-4 sticky top-4">
            <div className="space-y-5">
              <div>
                <Label htmlFor="q">Search</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="q"
                    placeholder="Search products..."
                    defaultValue={filters.q}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const target = e.target as HTMLInputElement
                        setFilters({ q: target.value })
                      }
                    }}
                  />
                  <Button onClick={() => {
                    const input = document.getElementById("q") as HTMLInputElement
                    setFilters({ q: input?.value || "" })
                  }}>Go</Button>
                </div>
              </div>

              <div>
                <Label>Categories</Label>
                <div className="mt-2 space-y-2 max-h-56 overflow-auto pr-1">
                  {categories.map((cat) => {
                    const checked = filters.categories.includes(cat.slug.current)
                    return (
                      <div key={cat._id} className="flex items-center gap-2">
                        <Checkbox
                          id={`cat-${cat._id}`}
                          checked={checked}
                          onCheckedChange={(val) => {
                            const current = new Set(filters.categories)
                            if (val) current.add(cat.slug.current); else current.delete(cat.slug.current)
                            setFilters({ categories: Array.from(current) })
                          }}
                        />
                        <Label htmlFor={`cat-${cat._id}`} className="capitalize cursor-pointer">
                          {cat.name}
                        </Label>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <Label>Price range</Label>
                <div className="mt-3">
                  <Slider
                    value={[priceRange[0], priceRange[1]]}
                    step={10}
                    min={PRICE_RANGE_DEFAULT[0]}
                    max={PRICE_RANGE_DEFAULT[1]}
                    onValueChange={(v) => setPriceRange([v[0] as number, v[1] as number])}
                    onValueCommit={(v) => setFilters({ minPrice: v[0] as number, maxPrice: v[1] as number })}
                  />
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-700">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="in-stock"
                    checked={filters.inStock}
                    onCheckedChange={(v) => setFilters({ inStock: Boolean(v) })}
                  />
                  <Label htmlFor="in-stock">In stock</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="featured"
                    checked={filters.featured}
                    onCheckedChange={(v) => setFilters({ featured: Boolean(v) })}
                  />
                  <Label htmlFor="featured">Featured</Label>
                </div>
              </div>

              <div>
                <Label>Sort by</Label>
                <div className="mt-2">
                  <Select value={filters.sort} onValueChange={(v) => setFilters({ sort: v as any })}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select sort" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price_asc">Price: Low to High</SelectItem>
                      <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setFilters({
                  q: "",
                  categories: [],
                  minPrice: undefined,
                  maxPrice: undefined,
                  inStock: false,
                  featured: false,
                  sort: "newest",
                })}>Clear</Button>
                <Button className="flex-1" onClick={() => setFilters({ page: 1 })}>Apply</Button>
              </div>
            </div>
          </Card>
        </aside>

        {/* Content */}
        <section className="md:col-span-9 lg:col-span-9">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {isPending ? "Loading products…" : `${total} result${total === 1 ? "" : "s"}`}
            </p>
            <div className="md:hidden">
              {/* Mobile sort quick control */}
              <Select value={filters.sort} onValueChange={(v) => setFilters({ sort: v as any })}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {items.length === 0 && !isPending ? (
            <div className="text-center py-16 border rounded-lg">
              <h3 className="text-lg font-semibold">No products found</h3>
              <p className="text-sm text-gray-600 mt-1">Try adjusting your filters.</p>
              <Button className="mt-4" variant="outline" onClick={() => setFilters({
                q: "",
                categories: [],
                minPrice: undefined,
                maxPrice: undefined,
                inStock: false,
                featured: false,
                sort: "newest",
              })}>Reset filters</Button>
            </div>
          ) : (
            <div className={cn("grid gap-4", "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3")}> 
              {items.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                disabled={filters.page <= 1}
                onClick={() => setFilters({ page: Math.max(1, filters.page - 1) })}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }).slice(0, 6).map((_, idx) => {
                const pageNum = idx + 1
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === filters.page ? "default" : "outline"}
                    onClick={() => setFilters({ page: pageNum })}
                  >
                    {pageNum}
                  </Button>
                )
              })}
              <Button
                variant="outline"
                disabled={filters.page >= totalPages}
                onClick={() => setFilters({ page: Math.min(totalPages, filters.page + 1) })}
              >
                Next
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading…</div>}>
      <ProductsPageInner />
    </Suspense>
  )
}
