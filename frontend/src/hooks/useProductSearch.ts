import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Product } from '../data/db'

export function useProductSearch(products: Product[]) {
  const [query, setQuery] = useState('')

  const normalized = query.trim().toLowerCase()

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<string>
      if (custom.detail !== undefined) setQuery(String(custom.detail))
    }
    window.addEventListener('app:search', handler as EventListener)
    return () => window.removeEventListener('app:search', handler as EventListener)
  }, [])

  const filtered = useMemo(() => {
    if (!normalized) return products
    return products.filter((p) => {
      const haystack = [
        p.name,
        p.description,
        p.category,
        p.specs.color,
        p.specs.dimensions,
        p.specs.warranty,
        p.specs.weight,
        ...p.specs.materials,
      ]
        .join(' ')
        .toLowerCase()

      return haystack.includes(normalized)
    })
  }, [products, normalized])

  const handleSearch = useCallback((q: string) => setQuery(q), [])

  return { query, setQuery, filtered, handleSearch }
}
