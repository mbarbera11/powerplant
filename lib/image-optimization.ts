"use client"

import { useEffect } from "react"

import { useState } from "react"

interface ImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  quality?: number
  priority?: boolean
  placeholder?: "blur" | "empty"
  blurDataURL?: string
}

export function optimizeImageUrl(src: string, width?: number, height?: number, quality = 75): string {
  // If it's already an optimized URL or external URL, return as-is
  if (src.startsWith("http") || src.includes("/_next/image")) {
    return src
  }

  const params = new URLSearchParams()

  if (width) params.set("w", width.toString())
  if (height) params.set("h", height.toString())
  params.set("q", quality.toString())

  return `/_next/image?url=${encodeURIComponent(src)}&${params.toString()}`
}

export function generateBlurDataURL(width = 8, height = 8): string {
  // Generate a simple blur placeholder
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext("2d")
  if (!ctx) return ""

  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, "#2D5A27")
  gradient.addColorStop(1, "#F4D03F")

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  return canvas.toDataURL()
}

// Lazy loading intersection observer
export function useLazyLoading() {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [ref, setRef] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: "50px",
      },
    )

    observer.observe(ref)

    return () => observer.disconnect()
  }, [ref])

  return [setRef, isIntersecting] as const
}
