export interface WeatherData {
  temperature: number
  humidity: number
  conditions: string
  hardiness_zone: string
  frost_dates: {
    last_spring: string
    first_fall: string
  }
  uvIndex: number
  windSpeed: number
  precipitation: number
  soilMoisture: number
  plantingSeason: string
  recommendations: string[]
}

export interface LocationData {
  lat: number
  lng: number
  city: string
  state: string
  zipCode: string
}

export interface PlantingConditions {
  ideal: boolean
  temperature: {
    min: number
    max: number
    current: number
    suitable: boolean
  }
  humidity: {
    min: number
    max: number
    current: number
    suitable: boolean
  }
  season: {
    current: string
    suitable: string[]
  }
}

export async function getWeatherData(location: LocationData): Promise<WeatherData> {
  try {
    const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY

    if (!API_KEY) {
      // Return enhanced mock data for development
      return {
        temperature: 75,
        humidity: 65,
        conditions: "Partly Cloudy",
        hardiness_zone: "8b",
        frost_dates: {
          last_spring: "March 15",
          first_fall: "November 20",
        },
        uvIndex: 6,
        windSpeed: 8,
        precipitation: 0,
        soilMoisture: 45,
        plantingSeason: determinePlantingSeason(new Date().getMonth(), "8b"),
        recommendations: [
          "Great conditions for spring planting",
          "Perfect for tomatoes and peppers",
          "Consider mulching to retain moisture"
        ]
      }
    }

    // Get current weather
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=${API_KEY}&units=imperial`,
    )

    if (!weatherResponse.ok) {
      throw new Error("Weather API request failed")
    }

    const weatherData = await weatherResponse.json()

    // Get UV index
    const uvResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/uvi?lat=${location.lat}&lon=${location.lng}&appid=${API_KEY}`
    )

    const uvData = uvResponse.ok ? await uvResponse.json() : { value: 0 }

    // Calculate hardiness zone based on location
    const hardinessZone = calculateHardinessZone(location.lat)
    const plantingSeason = determinePlantingSeason(new Date().getMonth(), hardinessZone)

    const weatherResult = {
      temperature: Math.round(weatherData.main.temp),
      humidity: weatherData.main.humidity,
      conditions: weatherData.weather[0].description,
      hardiness_zone: hardinessZone,
      frost_dates: calculateFrostDates(hardinessZone),
      uvIndex: uvData.value || 0,
      windSpeed: weatherData.wind?.speed || 0,
      precipitation: weatherData.rain?.['1h'] || weatherData.snow?.['1h'] || 0,
      soilMoisture: calculateSoilMoisture(weatherData.main.humidity, weatherData.rain?.['1h'] || 0),
      plantingSeason,
      recommendations: generatePlantingRecommendations(weatherData, hardinessZone, plantingSeason)
    }

    return weatherResult
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
      uvIndex: 5,
      windSpeed: 10,
      precipitation: 0,
      soilMoisture: 40,
      plantingSeason: "Spring",
      recommendations: [
        "Check local weather conditions",
        "Consider hardy plants for your region",
        "Consult local gardening guides"
      ]
    }
  }
}

function calculateHardinessZone(latitude: number): string {
  // Enhanced hardiness zone calculation
  if (latitude >= 50) return "3a"
  if (latitude >= 45) return "4b"
  if (latitude >= 40) return "6a"
  if (latitude >= 35) return "7b"
  if (latitude >= 30) return "8b"
  if (latitude >= 25) return "9b"
  return "10a"
}

function calculateFrostDates(zone: string): { last_spring: string; first_fall: string } {
  const frostDates: Record<string, { last_spring: string; first_fall: string }> = {
    "3a": { last_spring: "May 15", first_fall: "September 15" },
    "4b": { last_spring: "May 1", first_fall: "October 1" },
    "6a": { last_spring: "April 15", first_fall: "October 15" },
    "7b": { last_spring: "April 1", first_fall: "November 1" },
    "8b": { last_spring: "March 15", first_fall: "November 20" },
    "9b": { last_spring: "February 15", first_fall: "December 15" },
    "10a": { last_spring: "January 30", first_fall: "December 30" },
  }

  return frostDates[zone] || frostDates["8b"]
}

function determinePlantingSeason(month: number, zone: string): string {
  // Enhanced seasonal determination based on month and zone
  const seasons = {
    spring: [2, 3, 4, 5],
    summer: [5, 6, 7, 8],
    fall: [8, 9, 10, 11],
    winter: [11, 0, 1, 2]
  }
  
  if (seasons.spring.includes(month)) return "Spring"
  if (seasons.summer.includes(month)) return "Summer"
  if (seasons.fall.includes(month)) return "Fall"
  return "Winter"
}

function calculateSoilMoisture(humidity: number, precipitation: number): number {
  // Calculate estimated soil moisture percentage
  const baseLevel = 30
  const humidityFactor = (humidity - 50) * 0.4
  const precipitationFactor = precipitation * 10
  
  return Math.max(0, Math.min(100, baseLevel + humidityFactor + precipitationFactor))
}

function generatePlantingRecommendations(weatherData: any, zone: string, season: string): string[] {
  const recommendations = []
  const temp = weatherData.main.temp
  const humidity = weatherData.main.humidity
  const conditions = weatherData.weather[0].main.toLowerCase()
  
  // Temperature-based recommendations
  if (temp >= 60 && temp <= 75) {
    recommendations.push("Perfect temperature for most vegetables and herbs")
  } else if (temp > 75 && temp <= 85) {
    recommendations.push("Great for heat-loving plants like tomatoes, peppers, and basil")
  } else if (temp > 85) {
    recommendations.push("Very hot - focus on heat-tolerant plants and provide shade")
  } else if (temp >= 45 && temp < 60) {
    recommendations.push("Cool weather ideal for lettuce, spinach, and peas")
  } else if (temp < 45) {
    recommendations.push("Too cold for most planting - consider indoor growing")
  }
  
  // Humidity-based recommendations
  if (humidity > 80) {
    recommendations.push("High humidity - ensure good air circulation to prevent disease")
  } else if (humidity < 30) {
    recommendations.push("Low humidity - increase watering and consider mulching")
  } else {
    recommendations.push("Good humidity levels for most plants")
  }
  
  // Condition-based recommendations
  if (conditions.includes('rain')) {
    recommendations.push("Rainy conditions - postpone planting and ensure drainage")
  } else if (conditions.includes('clear') || conditions.includes('sunny')) {
    recommendations.push("Clear skies - excellent for planting and outdoor work")
  } else if (conditions.includes('cloud')) {
    recommendations.push("Overcast conditions - good for transplanting seedlings")
  }
  
  // Seasonal recommendations
  if (season === "Spring") {
    recommendations.push("Spring planting season - start cool-season crops")
  } else if (season === "Summer") {
    recommendations.push("Summer growing season - focus on warm-season plants")
  } else if (season === "Fall") {
    recommendations.push("Fall planting - good for root vegetables and cover crops")
  } else {
    recommendations.push("Winter season - consider cold frames or indoor growing")
  }
  
  // Zone-specific recommendations
  if (zone.includes('10') || zone.includes('9')) {
    recommendations.push("Warm zone - try tropical plants and year-round growing")
  } else if (zone.includes('3') || zone.includes('4')) {
    recommendations.push("Cold zone - focus on hardy perennials and short-season crops")
  } else {
    recommendations.push("Moderate zone - wide variety of plants suitable")
  }
  
  return recommendations.length > 0 ? recommendations : ["General planting conditions apply"]
}

export function analyzePlantingConditions(weatherData: WeatherData, plantType: string): PlantingConditions {
  // Plant-specific optimal conditions database
  const optimalConditions = {
    tomatoes: { tempMin: 65, tempMax: 85, humidityMin: 40, humidityMax: 70, seasons: ["Spring", "Summer"] },
    lettuce: { tempMin: 45, tempMax: 70, humidityMin: 50, humidityMax: 80, seasons: ["Spring", "Fall"] },
    peppers: { tempMin: 70, tempMax: 90, humidityMin: 30, humidityMax: 60, seasons: ["Spring", "Summer"] },
    herbs: { tempMin: 60, tempMax: 80, humidityMin: 40, humidityMax: 65, seasons: ["Spring", "Summer", "Fall"] },
    carrots: { tempMin: 50, tempMax: 75, humidityMin: 45, humidityMax: 70, seasons: ["Spring", "Fall"] },
    beans: { tempMin: 60, tempMax: 80, humidityMin: 50, humidityMax: 70, seasons: ["Spring", "Summer"] },
    spinach: { tempMin: 35, tempMax: 70, humidityMin: 50, humidityMax: 80, seasons: ["Spring", "Fall", "Winter"] },
    default: { tempMin: 60, tempMax: 75, humidityMin: 40, humidityMax: 70, seasons: ["Spring", "Summer"] }
  }
  
  const conditions = optimalConditions[plantType as keyof typeof optimalConditions] || optimalConditions.default
  
  const tempSuitable = weatherData.temperature >= conditions.tempMin && weatherData.temperature <= conditions.tempMax
  const humiditySuitable = weatherData.humidity >= conditions.humidityMin && weatherData.humidity <= conditions.humidityMax
  const seasonSuitable = conditions.seasons.includes(weatherData.plantingSeason)
  
  return {
    ideal: tempSuitable && humiditySuitable && seasonSuitable,
    temperature: {
      min: conditions.tempMin,
      max: conditions.tempMax,
      current: weatherData.temperature,
      suitable: tempSuitable
    },
    humidity: {
      min: conditions.humidityMin,
      max: conditions.humidityMax,
      current: weatherData.humidity,
      suitable: humiditySuitable
    },
    season: {
      current: weatherData.plantingSeason,
      suitable: conditions.seasons
    }
  }
}

export function getPlantingCalendar(hardinessZone: string): Record<string, string[]> {
  const calendar: Record<string, Record<string, string[]>> = {
    "3a": {
      "Spring": ["peas", "lettuce", "spinach", "radishes"],
      "Summer": ["beans", "corn", "tomatoes", "peppers"],
      "Fall": ["carrots", "beets", "kale", "cabbage"],
      "Winter": ["indoor herbs", "microgreens"]
    },
    "6a": {
      "Spring": ["lettuce", "peas", "carrots", "onions", "herbs"],
      "Summer": ["tomatoes", "peppers", "beans", "corn", "squash"],
      "Fall": ["broccoli", "cauliflower", "spinach", "garlic"],
      "Winter": ["cover crops", "indoor growing"]
    },
    "8b": {
      "Spring": ["all vegetables", "herbs", "flowers"],
      "Summer": ["heat-loving plants", "tropical herbs"],
      "Fall": ["cool-season crops", "root vegetables"],
      "Winter": ["leafy greens", "cool-season herbs"]
    },
    "10a": {
      "Spring": ["tropical plants", "all vegetables"],
      "Summer": ["heat-tolerant varieties"],
      "Fall": ["year-round growing"],
      "Winter": ["continued growing season"]
    }
  }

  return calendar[hardinessZone] || calendar["8b"]
}