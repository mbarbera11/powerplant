export interface Plant {
  id: string
  name: string
  scientificName: string
  image: string
  images: string[]
  matchScore: number
  sunRequirement: "full-sun" | "partial-shade" | "full-shade" | "mixed"
  waterNeeds: "low" | "medium" | "high"
  careLevel: 1 | 2 | 3 | 4 | 5
  plantType: string
  bloomTime: string[]
  peakMonths: string[]
  winterHardiness: string
  priceRange: string
  matureSize: string
  spacing: string
  plantingTime: string[]
  companionPlants: string[]
  commonProblems: string[]
  whyRecommended: string[]
  features: string[]
  description: string
  careInstructions: {
    watering: string
    fertilizing: string
    pruning: string
    pests: string
  }
  hardinessZones: string[]
  nativeRegions: string[]
  seasonalCare: {
    spring: string
    summer: string
    fall: string
    winter: string
  }
}

export interface PlantFilters {
  plantType: string
  sunRequirement: string
  careLevel: string
  bloomTime: string
  priceRange: string
  search: string
  nativeOnly: boolean
  pollinatorFriendly: boolean
  droughtTolerant: boolean
}

export interface PlantRecommendationRequest {
  location: {
    lat: number
    lng: number
    hardinessZone: string
    city: string
    state: string
  }
  preferences: {
    plantTypes: string[]
    sunExposure: string
    experienceLevel: string
    gardenSize: string
    primaryGoal: string
    maintenancePreference: string
    budgetRange: string
    specialInterests: string[]
    colorPreferences: string[]
  }
}
