"use client"

import { useMemo, useState, useEffect } from "react"

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function useFuzzySearch<T>(
  items: T[],
  searchTerm: string,
  searchFields: (keyof T)[],
  options: {
    threshold?: number
    debounceMs?: number
  } = {},
) {
  const { threshold = 0.3, debounceMs = 300 } = options
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs)

  return useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return items
    }

    const searchLower = debouncedSearchTerm.toLowerCase()

    return items
      .filter((item) => {
        return searchFields.some((field) => {
          const fieldValue = String(item[field]).toLowerCase()
          return fieldValue.includes(searchLower) || calculateSimilarity(fieldValue, searchLower) > threshold
        })
      })
      .sort((a, b) => {
        // Sort by relevance
        const aScore = Math.max(
          ...searchFields.map((field) => calculateSimilarity(String(a[field]).toLowerCase(), searchLower)),
        )
        const bScore = Math.max(
          ...searchFields.map((field) => calculateSimilarity(String(b[field]).toLowerCase(), searchLower)),
        )
        return bScore - aScore
      })
  }, [items, debouncedSearchTerm, searchFields, threshold])
}

function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1

  if (longer.length === 0) {
    return 1.0
  }

  const editDistance = levenshteinDistance(longer, shorter)
  return (longer.length - editDistance) / longer.length
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = []

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
      }
    }
  }

  return matrix[str2.length][str1.length]
}
