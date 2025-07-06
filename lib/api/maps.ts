export interface NurseryLocation {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  rating: number
  phone?: string
  website?: string
  distance?: number
  hours?: string[]
  photos?: string[]
  specialties?: string[]
  priceLevel?: number
  reviews?: NurseryReview[]
  isOpenNow?: boolean
}

export interface NurseryReview {
  author: string
  rating: number
  text: string
  time: string
}

export interface NurseryDetails {
  location: NurseryLocation
  details: {
    description?: string
    services?: string[]
    plantVarieties?: string[]
    deliveryAvailable?: boolean
    expertAdvice?: boolean
    workshopsAvailable?: boolean
  }
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'demo_key'

export async function getNearbyNurseries(lat: number, lng: number, radius = 25000): Promise<NurseryLocation[]> {
  try {
    if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'demo_key') {
      // Return enhanced mock data for development
      return [
        {
          id: "1",
          name: "Green Thumb Garden Center",
          address: "1234 Garden Way, Austin, TX 78701",
          lat: 30.2672,
          lng: -97.7431,
          rating: 4.8,
          phone: "(512) 555-0123",
          website: "www.greenthumbgarden.com",
          distance: 2.3,
          hours: ["Mon-Fri: 8AM-7PM", "Sat-Sun: 9AM-6PM"],
          specialties: ["Native Plants", "Organic Vegetables", "Fruit Trees"],
          priceLevel: 2,
          isOpenNow: true,
          photos: ["/placeholder.jpg"],
          reviews: [
            {
              author: "Jane Doe",
              rating: 5,
              text: "Amazing selection of native plants!",
              time: "2 weeks ago"
            }
          ]
        },
        {
          id: "2",
          name: "Austin Native Plant Society",
          address: "5678 Native Trail, Austin, TX 78704",
          lat: 30.25,
          lng: -97.75,
          rating: 4.6,
          phone: "(512) 555-0456",
          website: "www.austinnativeplants.org",
          distance: 4.1,
          hours: ["Tue-Sat: 9AM-5PM", "Closed Mon & Sun"],
          specialties: ["Native Texas Plants", "Drought Resistant", "Wildlife Gardens"],
          priceLevel: 1,
          isOpenNow: false,
          photos: ["/placeholder.jpg"],
          reviews: [
            {
              author: "John Smith",
              rating: 4,
              text: "Great expertise in native plants",
              time: "1 month ago"
            }
          ]
        },
        {
          id: "3",
          name: "Urban Harvest Nursery",
          address: "9876 Organic Ave, Austin, TX 78705",
          lat: 30.3072,
          lng: -97.7231,
          rating: 4.9,
          phone: "(512) 555-0789",
          website: "www.urbanharvest.com",
          distance: 1.8,
          hours: ["Daily: 7AM-8PM"],
          specialties: ["Organic Herbs", "Vegetable Starts", "Permaculture"],
          priceLevel: 3,
          isOpenNow: true,
          photos: ["/placeholder.jpg"],
          reviews: [
            {
              author: "Maria Garcia",
              rating: 5,
              text: "Best organic vegetable starts in town!",
              time: "1 week ago"
            }
          ]
        }
      ]
    }

    // Primary search for nurseries and garden centers
    const nurseryResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=store&keyword=nursery+garden+center&key=${GOOGLE_MAPS_API_KEY}`
    )

    if (!nurseryResponse.ok) {
      throw new Error("Maps API request failed")
    }

    const nurseryData = await nurseryResponse.json()

    // Secondary search for plant stores
    const plantStoreResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=store&keyword=plant+store+greenhouse&key=${GOOGLE_MAPS_API_KEY}`
    )

    const plantStoreData = plantStoreResponse.ok ? await plantStoreResponse.json() : { results: [] }

    // Combine and deduplicate results
    const allResults = [...nurseryData.results, ...plantStoreData.results]
    const uniqueResults = allResults.filter((place, index, self) => 
      index === self.findIndex(p => p.place_id === place.place_id)
    )

    // Process and enhance results
    const nurseries = await Promise.all(
      uniqueResults.map(async (place: any) => {
        const distance = calculateDistance(lat, lng, place.geometry.location.lat, place.geometry.location.lng)
        
        // Get additional details for each place
        const details = await getNurseryDetails(place.place_id)
        
        return {
          id: place.place_id,
          name: place.name,
          address: place.vicinity || place.formatted_address,
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
          rating: place.rating || 0,
          phone: place.formatted_phone_number,
          website: place.website,
          distance: Math.round(distance * 10) / 10,
          hours: place.opening_hours?.weekday_text || [],
          photos: place.photos?.slice(0, 3).map((photo: any) => 
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_MAPS_API_KEY}`
          ) || [],
          specialties: generateSpecialties(place),
          priceLevel: place.price_level || 0,
          isOpenNow: place.opening_hours?.open_now || false,
          reviews: details.reviews || []
        }
      })
    )

    // Sort by distance and rating
    return nurseries
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))
      .slice(0, 20) // Limit to 20 results
  } catch (error) {
    console.error("Maps API error:", error)
    return []
  }
}

export async function getNurseryDetails(placeId: string): Promise<{ reviews: NurseryReview[] }> {
  try {
    if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'demo_key') {
      return { reviews: [] }
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${GOOGLE_MAPS_API_KEY}`
    )

    if (!response.ok) {
      return { reviews: [] }
    }

    const data = await response.json()
    
    return {
      reviews: (data.result?.reviews || []).slice(0, 5).map((review: any) => ({
        author: review.author_name,
        rating: review.rating,
        text: review.text,
        time: review.relative_time_description
      }))
    }
  } catch (error) {
    console.error("Error fetching nursery details:", error)
    return { reviews: [] }
  }
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959 // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

function generateSpecialties(place: any): string[] {
  const specialties = []
  const name = place.name.toLowerCase()
  const types = place.types || []
  
  // Infer specialties from name and types
  if (name.includes('native') || name.includes('indigenous')) {
    specialties.push('Native Plants')
  }
  if (name.includes('organic') || name.includes('natural')) {
    specialties.push('Organic')
  }
  if (name.includes('rose') || name.includes('flower')) {
    specialties.push('Flowers & Roses')
  }
  if (name.includes('tree') || name.includes('fruit')) {
    specialties.push('Trees & Fruit')
  }
  if (name.includes('vegetable') || name.includes('herb')) {
    specialties.push('Vegetables & Herbs')
  }
  if (name.includes('succulent') || name.includes('cactus')) {
    specialties.push('Succulents & Cacti')
  }
  if (name.includes('greenhouse') || name.includes('tropical')) {
    specialties.push('Tropical Plants')
  }
  
  // Default specialties if none detected
  if (specialties.length === 0) {
    specialties.push('General Plants', 'Garden Supplies')
  }
  
  return specialties
}

export function getDirectionsUrl(destination: string): string {
  const encodedDestination = encodeURIComponent(destination)
  return `https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}`
}

export function getPlaceUrl(placeId: string): string {
  return `https://www.google.com/maps/place/?q=place_id:${placeId}`
}

export async function searchNurseriesByPlantType(
  lat: number, 
  lng: number, 
  plantType: string, 
  radius = 25000
): Promise<NurseryLocation[]> {
  try {
    const keywords = getPlantTypeKeywords(plantType)
    const allNurseries = await getNearbyNurseries(lat, lng, radius)
    
    // Filter nurseries based on plant type specialties
    const filteredNurseries = allNurseries.filter(nursery => 
      nursery.specialties?.some(specialty => 
        keywords.some(keyword => 
          specialty.toLowerCase().includes(keyword.toLowerCase())
        )
      ) || nursery.name.toLowerCase().includes(plantType.toLowerCase())
    )
    
    return filteredNurseries.length > 0 ? filteredNurseries : allNurseries
  } catch (error) {
    console.error("Error searching nurseries by plant type:", error)
    return []
  }
}

function getPlantTypeKeywords(plantType: string): string[] {
  const keywordMap: Record<string, string[]> = {
    'tomatoes': ['vegetable', 'herbs', 'organic'],
    'roses': ['flowers', 'roses', 'perennial'],
    'succulents': ['succulent', 'cacti', 'drought'],
    'herbs': ['herbs', 'vegetable', 'organic'],
    'trees': ['trees', 'fruit', 'native'],
    'vegetables': ['vegetable', 'herbs', 'organic'],
    'flowers': ['flowers', 'perennial', 'annual'],
    'native': ['native', 'indigenous', 'wildlife'],
    'fruit': ['fruit', 'trees', 'organic'],
    'houseplants': ['indoor', 'tropical', 'houseplant']
  }
  
  return keywordMap[plantType.toLowerCase()] || [plantType]
}

export function generateShoppingList(plants: string[], nursery: NurseryLocation): {
  nursery: NurseryLocation
  plants: string[]
  estimatedTotal: number
  notes: string[]
} {
  // Estimate prices based on plant types (mock implementation)
  const plantPrices: Record<string, number> = {
    'tomatoes': 8,
    'peppers': 8,
    'herbs': 6,
    'lettuce': 4,
    'roses': 25,
    'trees': 45,
    'succulents': 12,
    'flowers': 8
  }
  
  const total = plants.reduce((sum, plant) => {
    const price = plantPrices[plant.toLowerCase()] || 10
    return sum + price
  }, 0)
  
  const notes = [
    "Call ahead to check availability",
    "Ask about planting tips and care instructions",
    "Consider soil amendments and fertilizers"
  ]
  
  if (nursery.specialties?.includes('Organic')) {
    notes.push("Ask about organic soil and pest control options")
  }
  
  return {
    nursery,
    plants,
    estimatedTotal: total,
    notes
  }
}