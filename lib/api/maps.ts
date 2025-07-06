interface NurseryLocation {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  rating: number
  phone?: string
  website?: string
}

export async function getNearbyNurseries(lat: number, lng: number, radius = 25000): Promise<NurseryLocation[]> {
  try {
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    if (!API_KEY) {
      // Return mock data for development
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
        },
      ]
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=store&keyword=nursery+garden+center&key=${API_KEY}`,
    )

    if (!response.ok) {
      throw new Error("Maps API request failed")
    }

    const data = await response.json()

    return data.results.map((place: any) => ({
      id: place.place_id,
      name: place.name,
      address: place.vicinity,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      rating: place.rating || 0,
      phone: place.formatted_phone_number,
      website: place.website,
    }))
  } catch (error) {
    console.error("Maps API error:", error)
    return []
  }
}

export function getDirectionsUrl(destination: string): string {
  const encodedDestination = encodeURIComponent(destination)
  return `https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}`
}
