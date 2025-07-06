import type { Plant } from "@/types/plant"

// Plant database - in production this would be a proper API
const PLANT_DATABASE: Plant[] = [
  {
    id: "1",
    name: "Marigold",
    scientificName: "Tagetes patula",
    image: "/images/plants/marigold.jpg",
    images: ["/images/plants/marigold-1.jpg", "/images/plants/marigold-2.jpg", "/images/plants/marigold-3.jpg"],
    matchScore: 5,
    sunRequirement: "full-sun",
    waterNeeds: "medium",
    careLevel: 2,
    plantType: "Annual Flower",
    bloomTime: ["Spring", "Summer", "Fall"],
    peakMonths: ["June", "July", "August"],
    winterHardiness: "Annual - replant yearly",
    priceRange: "$3-8",
    matureSize: "6-12 inches tall, 6-9 inches wide",
    spacing: "6-8 inches apart",
    plantingTime: ["March", "April", "May"],
    companionPlants: ["Tomatoes", "Basil", "Peppers"],
    commonProblems: ["Aphids", "Spider mites", "Powdery mildew"],
    whyRecommended: [
      "Perfect for your full-sun location",
      "Matches your beginner experience level",
      "Blooms continuously through summer",
      "Natural pest deterrent for vegetables",
    ],
    features: ["Pest repellent", "Long blooming", "Heat tolerant", "Easy care"],
    description:
      "Bright, cheerful flowers that bloom from spring until frost. Perfect for beginners and excellent companion plants.",
    careInstructions: {
      watering: "Water when soil feels dry to touch, typically 2-3 times per week",
      fertilizing: "Feed monthly with balanced fertilizer during growing season",
      pruning: "Deadhead spent flowers to encourage more blooms",
      pests: "Watch for aphids and treat with insecticidal soap if needed",
    },
    hardinessZones: ["3a", "4a", "5a", "6a", "7a", "8a", "8b", "9a", "9b", "10a", "10b"],
    nativeRegions: [],
    seasonalCare: {
      spring: "Plant after last frost, prepare soil with compost",
      summer: "Regular watering, deadhead spent blooms, watch for pests",
      fall: "Continue deadheading until first frost, collect seeds",
      winter: "Remove spent plants, plan for next year's garden",
    },
  },
  // Add more plants...
]

export async function getPlantRecommendations(
  location: { lat: number; lng: number; hardinessZone: string },
  preferences: {
    plantTypes: string[]
    sunExposure: string
    experienceLevel: string
    gardenSize: string
  },
): Promise<Plant[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Filter plants based on criteria
  const filteredPlants = PLANT_DATABASE.filter((plant) => {
    // Check hardiness zone compatibility
    if (!plant.hardinessZones.includes(location.hardinessZone)) {
      return false
    }

    // Check plant type preferences
    if (preferences.plantTypes.length > 0) {
      const plantTypeMatch = preferences.plantTypes.some((type) =>
        plant.plantType.toLowerCase().includes(type.toLowerCase()),
      )
      if (!plantTypeMatch) return false
    }

    // Check sun exposure compatibility
    if (preferences.sunExposure && preferences.sunExposure !== "mixed") {
      if (plant.sunRequirement !== preferences.sunExposure) {
        return false
      }
    }

    // Check experience level
    if (preferences.experienceLevel === "beginner" && plant.careLevel > 2) {
      return false
    }

    return true
  })

  // Sort by match score and return
  return filteredPlants.sort((a, b) => b.matchScore - a.matchScore)
}

export async function getPlantById(id: string): Promise<Plant | null> {
  const plant = PLANT_DATABASE.find((p) => p.id === id)
  return plant || null
}

export async function searchPlants(query: string): Promise<Plant[]> {
  const lowercaseQuery = query.toLowerCase()
  return PLANT_DATABASE.filter(
    (plant) =>
      plant.name.toLowerCase().includes(lowercaseQuery) ||
      plant.scientificName.toLowerCase().includes(lowercaseQuery) ||
      plant.features.some((feature) => feature.toLowerCase().includes(lowercaseQuery)),
  )
}
