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

export interface LocationCoordinates {
  lat: number
  lng: number
  city: string
  state: string
  zipCode?: string
  formattedAddress: string
  hardinessZone?: string
}

// Comprehensive hardiness zone mapping based on zip code patterns and states
function getHardinessZoneFromLocation(zipCode: string, state: string, lat: number): string {
  // Direct zip code mappings for specific areas
  const zipZoneMap: Record<string, string> = {
    // Texas major cities
    '78701': '8b', '78702': '8b', '78703': '8b', '78704': '8b', '78705': '8b',
    '77001': '9a', '77002': '9a', '77003': '9a', // Houston
    '75201': '8a', '75202': '8a', '75203': '8a', // Dallas
    '78201': '9a', '78202': '9a', '78203': '9a', // San Antonio
    
    // California major cities
    '90210': '10a', '90211': '10a', '90212': '10a', // Beverly Hills
    '94102': '10a', '94103': '10a', '94104': '10a', // San Francisco
    '90001': '10a', '90002': '10a', '90003': '10a', // Los Angeles
    
    // New York
    '10001': '7a', '10002': '7a', '10003': '7a', // Manhattan
    '11201': '7a', '11202': '7a', '11203': '7a', // Brooklyn
    
    // Florida
    '33101': '10b', '33102': '10b', '33103': '10b', // Miami
    '32801': '9b', '32802': '9b', '32803': '9b', // Orlando
    
    // Illinois
    '60601': '6a', '60602': '6a', '60603': '6a', // Chicago
    
    // Colorado
    '80201': '5b', '80202': '5b', '80203': '5b', // Denver
    
    // Washington
    '98101': '9a', '98102': '9a', '98103': '9a', // Seattle
    
    // Arizona
    '85001': '9b', '85002': '9b', '85003': '9b', // Phoenix
  }
  
  // Check direct zip mapping first
  if (zipZoneMap[zipCode]) {
    return zipZoneMap[zipCode]
  }
  
  // State-based patterns and latitude-based calculations
  const stateZoneMap: Record<string, (lat: number, zip: string) => string> = {
    'FL': (lat: number) => lat > 26 ? '9b' : '10b',
    'HI': () => '11',
    'CA': (lat: number) => {
      if (lat > 40) return '9a'
      if (lat > 36) return '9b'
      if (lat > 33) return '10a'
      return '10b'
    },
    'AZ': (lat: number) => lat > 34 ? '8b' : '9a',
    'TX': (lat: number) => {
      if (lat > 32) return '8a'
      if (lat > 29) return '8b'
      return '9a'
    },
    'NV': (lat: number) => lat > 36 ? '7a' : '8b',
    'NM': (lat: number) => lat > 35 ? '6b' : '7a',
    'LA': () => '9a',
    'MS': () => '8b',
    'AL': (lat: number) => lat > 33 ? '8a' : '8b',
    'GA': (lat: number) => lat > 33 ? '8a' : '8b',
    'SC': (lat: number) => lat > 33 ? '8a' : '8b',
    'NC': (lat: number) => lat > 35 ? '7b' : '8a',
    'VA': (lat: number) => lat > 37 ? '7a' : '7b',
    'TN': (lat: number) => lat > 36 ? '7a' : '7b',
    'KY': (lat: number) => lat > 37 ? '6b' : '7a',
    'WV': (lat: number) => lat > 38 ? '6a' : '6b',
    'MD': (lat: number) => lat > 39 ? '7a' : '7b',
    'DE': () => '7a',
    'NJ': (lat: number) => lat > 40 ? '6b' : '7a',
    'PA': (lat: number) => lat > 41 ? '6a' : '6b',
    'NY': (lat: number) => {
      if (lat > 44) return '5a'
      if (lat > 42) return '5b'
      if (lat > 40) return '6b'
      return '7a'
    },
    'CT': () => '6b',
    'RI': () => '6b',
    'MA': (lat: number) => lat > 42 ? '6a' : '6b',
    'VT': (lat: number) => lat > 44 ? '4b' : '5a',
    'NH': (lat: number) => lat > 44 ? '4b' : '5a',
    'ME': (lat: number) => lat > 45 ? '4a' : '4b',
    'OH': (lat: number) => lat > 40 ? '6a' : '6b',
    'IN': (lat: number) => lat > 40 ? '6a' : '6b',
    'IL': (lat: number) => lat > 41 ? '5b' : '6a',
    'MI': (lat: number) => lat > 44 ? '5a' : '5b',
    'WI': (lat: number) => lat > 44 ? '4b' : '5a',
    'MN': (lat: number) => lat > 46 ? '3b' : '4a',
    'IA': (lat: number) => lat > 42 ? '5a' : '5b',
    'MO': (lat: number) => lat > 38 ? '6a' : '6b',
    'AR': (lat: number) => lat > 35 ? '7a' : '8a',
    'OK': (lat: number) => lat > 36 ? '7a' : '7b',
    'KS': (lat: number) => lat > 38 ? '6a' : '6b',
    'NE': (lat: number) => lat > 41 ? '5a' : '5b',
    'SD': (lat: number) => lat > 44 ? '4a' : '4b',
    'ND': (lat: number) => lat > 47 ? '3a' : '3b',
    'MT': (lat: number) => lat > 47 ? '4a' : '5a',
    'WY': (lat: number) => lat > 43 ? '4b' : '5a',
    'CO': (lat: number) => lat > 39 ? '5a' : '5b',
    'UT': (lat: number) => lat > 40 ? '6a' : '6b',
    'ID': (lat: number) => lat > 44 ? '5a' : '6a',
    'WA': (lat: number) => lat > 47 ? '8a' : '8b',
    'OR': (lat: number) => lat > 44 ? '8a' : '8b',
    'AK': (lat: number) => lat > 64 ? '1a' : '2a',
  }
  
  if (stateZoneMap[state]) {
    return stateZoneMap[state](lat, zipCode)
  }
  
  // Default fallback based on latitude
  if (lat > 45) return '4b'
  if (lat > 40) return '6a'
  if (lat > 35) return '7b'
  if (lat > 30) return '8b'
  if (lat > 25) return '9b'
  return '10a'
}

export async function geocodeLocation(locationInput: string): Promise<LocationCoordinates | null> {
  try {
    if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'demo_key') {
      // Return mock coordinates for development
      const mockLocations: Record<string, LocationCoordinates> = {
        '78701': { lat: 30.2672, lng: -97.7431, city: 'Austin', state: 'TX', zipCode: '78701', formattedAddress: 'Austin, TX 78701' },
        '90210': { lat: 34.0901, lng: -118.4065, city: 'Beverly Hills', state: 'CA', zipCode: '90210', formattedAddress: 'Beverly Hills, CA 90210' },
        '10001': { lat: 40.7589, lng: -73.9851, city: 'New York', state: 'NY', zipCode: '10001', formattedAddress: 'New York, NY 10001' },
        'austin': { lat: 30.2672, lng: -97.7431, city: 'Austin', state: 'TX', formattedAddress: 'Austin, TX' },
        'austin, tx': { lat: 30.2672, lng: -97.7431, city: 'Austin', state: 'TX', formattedAddress: 'Austin, TX' },
        'los angeles': { lat: 34.0522, lng: -118.2437, city: 'Los Angeles', state: 'CA', formattedAddress: 'Los Angeles, CA' },
        'new york': { lat: 40.7128, lng: -74.0060, city: 'New York', state: 'NY', formattedAddress: 'New York, NY' }
      }
      
      const normalizedInput = locationInput.toLowerCase().trim()
      const fallback = mockLocations[normalizedInput] || mockLocations['austin']
      return {
        ...fallback,
        hardinessZone: getHardinessZoneFromLocation(fallback.zipCode || '', fallback.state, fallback.lat)
      }
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationInput)}&key=${GOOGLE_MAPS_API_KEY}`
    )

    if (!response.ok) {
      throw new Error('Geocoding request failed')
    }

    const data = await response.json()
    
    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      return null
    }

    const result = data.results[0]
    const location = result.geometry.location
    
    // Extract city, state, and zip code from address components
    let city = ''
    let state = ''
    let zipCode = ''
    
    result.address_components?.forEach((component: any) => {
      if (component.types.includes('locality')) {
        city = component.long_name
      } else if (component.types.includes('administrative_area_level_1')) {
        state = component.short_name
      } else if (component.types.includes('postal_code')) {
        zipCode = component.long_name
      }
    })

    const coordinates = {
      lat: location.lat,
      lng: location.lng,
      city: city || 'Unknown City',
      state: state || 'Unknown State',
      zipCode: zipCode || undefined,
      formattedAddress: result.formatted_address
    }
    
    return {
      ...coordinates,
      hardinessZone: getHardinessZoneFromLocation(zipCode || '', state || '', location.lat)
    }
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

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