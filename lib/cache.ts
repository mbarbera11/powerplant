interface CacheItem<T> {
  data: T
  timestamp: number
  expiry: number
}

class Cache {
  private storage: Map<string, CacheItem<any>> = new Map()

  set<T>(key: string, data: T, ttlMinutes = 30): void {
    const expiry = Date.now() + ttlMinutes * 60 * 1000
    this.storage.set(key, {
      data,
      timestamp: Date.now(),
      expiry,
    })
  }

  get<T>(key: string): T | null {
    const item = this.storage.get(key)

    if (!item) {
      return null
    }

    if (Date.now() > item.expiry) {
      this.storage.delete(key)
      return null
    }

    return item.data
  }

  delete(key: string): void {
    this.storage.delete(key)
  }

  clear(): void {
    this.storage.clear()
  }

  // Cleanup expired items
  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.storage.entries()) {
      if (now > item.expiry) {
        this.storage.delete(key)
      }
    }
  }
}

export const cache = new Cache()

// Auto cleanup every 5 minutes
if (typeof window !== "undefined") {
  setInterval(
    () => {
      cache.cleanup()
    },
    5 * 60 * 1000,
  )
}

// Cache keys
export const CACHE_KEYS = {
  PLANT_RECOMMENDATIONS: "plant_recommendations",
  NURSERIES: "nurseries",
  WEATHER_DATA: "weather_data",
  USER_LOCATION: "user_location",
} as const
