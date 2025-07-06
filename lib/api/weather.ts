interface WeatherData {
  temperature: number
  humidity: number
  conditions: string
  hardiness_zone: string
  frost_dates: {
    last_spring: string
    first_fall: string
  }
}

interface LocationData {
  lat: number
  lng: number
  city: string
  state: string
  zipCode: string
}

export async function getWeatherData(location: LocationData): Promise<WeatherData> {
  try {
    const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY

    if (!API_KEY) {
      // Return mock data for development
      return {
        temperature: 75,
        humidity: 65,
        conditions: "Partly Cloudy",
        hardiness_zone: "8b",
        frost_dates: {
          last_spring: "March 15",
          first_fall: "November 20",
        },
      }
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=${API_KEY}&units=imperial`,
    )

    if (!response.ok) {
      throw new Error("Weather API request failed")
    }

    const data = await response.json()

    // Calculate hardiness zone based on location (simplified)
    const hardinessZone = calculateHardinessZone(location.lat)

    return {
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      conditions: data.weather[0].description,
      hardiness_zone: hardinessZone,
      frost_dates: calculateFrostDates(hardinessZone),
    }
  } catch (error) {
    console.error("Weather API error:", error)
    // Return fallback data
    return {
      temperature: 72,
      humidity: 60,
      conditions: "Clear",
      hardiness_zone: "8a",
      frost_dates: {
        last_spring: "March 20",
        first_fall: "November 15",
      },
    }
  }
}

function calculateHardinessZone(latitude: number): string {
  // Simplified hardiness zone calculation
  if (latitude >= 45) return "3a"
  if (latitude >= 40) return "5a"
  if (latitude >= 35) return "7a"
  if (latitude >= 30) return "8b"
  if (latitude >= 25) return "9b"
  return "10a"
}

function calculateFrostDates(zone: string): { last_spring: string; first_fall: string } {
  const frostDates: Record<string, { last_spring: string; first_fall: string }> = {
    "3a": { last_spring: "May 15", first_fall: "September 15" },
    "5a": { last_spring: "April 15", first_fall: "October 15" },
    "7a": { last_spring: "April 1", first_fall: "November 1" },
    "8b": { last_spring: "March 15", first_fall: "November 20" },
    "9b": { last_spring: "February 15", first_fall: "December 15" },
    "10a": { last_spring: "January 30", first_fall: "December 30" },
  }

  return frostDates[zone] || frostDates["8b"]
}
