"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Sun,
  Cloud,
  CloudRain,
  Palette,
  Leaf,
  Flower,
  Carrot,
  TreePine,
  Star,
  DollarSign,
  Clock,
  Target,
  Home,
  Info,
  Zap,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface OnboardingData {
  // Step 1: Location & Climate
  location: {
    city: string
    state: string
    zipCode: string
    hardinessZone: string
    coordinates?: { lat: number; lng: number }
  }
  // Step 2: Garden Space & Experience
  gardenSpace: {
    gardenSize: string
    sunExposure: string
    experienceLevel: string
    maintenancePreference: string
    budgetRange: string
  }
  // Step 3: Plant Preferences
  preferences: {
    plantTypes: string[]
    primaryGoal: string
    specialInterests: string[]
    colorPreferences: string[]
  }
}

const HARDINESS_ZONES = {
  "10001": "7a",
  "90210": "10a",
  "60601": "6a",
  "30301": "8a",
  "80201": "5b",
  "98101": "9a",
  "33101": "10b",
  "78701": "8b",
  "97201": "9a",
  "02101": "6b",
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<OnboardingData>({
    location: { city: "", state: "", zipCode: "", hardinessZone: "" },
    gardenSpace: {
      gardenSize: "",
      sunExposure: "",
      experienceLevel: "",
      maintenancePreference: "",
      budgetRange: "",
    },
    preferences: {
      plantTypes: [],
      primaryGoal: "",
      specialInterests: [],
      colorPreferences: [],
    },
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const router = useRouter()

  // Check for saved location and category on component mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation')
    const savedCategory = localStorage.getItem('preferredCategory')
    
    if (savedLocation && savedLocation.trim() !== '') {
      // Parse location and auto-fill data using the same logic as handleZipCodeChange
      const hardinessZone = HARDINESS_ZONES[savedLocation as keyof typeof HARDINESS_ZONES] || "8a"
      
      // Determine city and state based on input
      let city = "Your City"
      let state = "Your State"
      
      // Handle known zip codes
      if (savedLocation === "78701") {
        city = "Austin"
        state = "TX"
      } else if (savedLocation.length === 5 && /^\d+$/.test(savedLocation)) {
        // If it's a 5-digit zip code, try to determine location
        city = `City for ${savedLocation}`
        state = "Your State"
      } else if (savedLocation.includes(",")) {
        // If it contains a comma, assume it's "City, State" format
        const parts = savedLocation.split(",").map(part => part.trim())
        city = parts[0] || "Your City"
        state = parts[1] || "Your State"
      } else if (savedLocation.length > 0) {
        // Assume it's just a city name
        city = savedLocation
        state = "Your State"
      }
      
      setData(prev => ({
        ...prev,
        location: {
          city,
          state,
          zipCode: savedLocation,
          hardinessZone,
        }
      }))
      
      // Skip to step 2 since location is already provided
      setCurrentStep(2)
      
      // Clear the saved location so it doesn't interfere with future visits
      localStorage.removeItem('userLocation')
    }
    
    if (savedCategory && savedCategory.trim() !== '') {
      // Pre-select the plant category if user chose one from landing page
      setData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          plantTypes: [savedCategory]
        }
      }))
      
      // Clear the saved category
      localStorage.removeItem('preferredCategory')
    }
  }, [])

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  const handleLocationDetection = async () => {
    setIsLoading(true)
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Mock location data based on coordinates
            setData((prev) => ({
              ...prev,
              location: {
                city: "Austin",
                state: "TX",
                zipCode: "78701",
                hardinessZone: "8b",
                coordinates: {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                },
              },
            }))
            setIsLoading(false)
          },
          () => {
            setIsLoading(false)
          },
        )
      }
    } catch (error) {
      setIsLoading(false)
    }
  }

  const handleZipCodeChange = (input: string) => {
    // Check if it's a known zip code
    const hardinessZone = HARDINESS_ZONES[input as keyof typeof HARDINESS_ZONES] || "8a"
    
    // Determine city and state based on input
    let city = "Your City"
    let state = "Your State"
    
    // Handle known zip codes
    if (input === "78701") {
      city = "Austin"
      state = "TX"
    } else if (input.length === 5 && /^\d+$/.test(input)) {
      // If it's a 5-digit zip code, try to determine location
      city = `City for ${input}`
      state = "Your State"
    } else if (input.includes(",")) {
      // If it contains a comma, assume it's "City, State" format
      const parts = input.split(",").map(part => part.trim())
      city = parts[0] || "Your City"
      state = parts[1] || "Your State"
    } else if (input.length > 0) {
      // Assume it's just a city name
      city = input
      state = "Your State"
    }
    
    setData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        zipCode: input,
        hardinessZone,
        city,
        state,
      },
    }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.location.zipCode.length >= 3
      case 2:
        return data.gardenSpace.gardenSize !== "" && data.gardenSpace.sunExposure !== "" && data.gardenSpace.experienceLevel !== ""
      case 3:
        return data.preferences.plantTypes.length > 0 && data.preferences.primaryGoal !== ""
      default:
        return false
    }
  }

  const stepTitles = [
    "Where will you grow?",
    "Tell us about your space",
    "What do you want to grow?"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-powerplant-green/5 via-white to-energy-yellow/5">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-powerplant-green/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-powerplant-green via-energy-yellow to-lightning-blue rounded-lg flex items-center justify-center relative overflow-hidden">
              <Leaf className="w-5 h-5 text-white absolute" />
              <Zap className="w-3 h-3 text-white absolute top-1 right-1 opacity-70" />
            </div>
            <span className="text-xl font-bold text-powerplant-green font-montserrat">PowerPlant</span>
          </Link>
          <div className="text-sm text-gray-600">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-powerplant-green">{stepTitles[currentStep - 1]}</span>
            <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="transition-all duration-500 ease-in-out">
          {currentStep === 1 && (
            <LocationStep
              data={data}
              setData={setData}
              onLocationDetection={handleLocationDetection}
              onZipCodeChange={handleZipCodeChange}
              isLoading={isLoading}
              showTooltip={showTooltip}
              setShowTooltip={setShowTooltip}
            />
          )}
          {currentStep === 2 && <GardenSpaceStep data={data} setData={setData} />}
          {currentStep === 3 && <PlantPreferencesStep data={data} setData={setData} />}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="flex items-center gap-4">
            {currentStep < totalSteps ? (
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-powerplant-green to-powerplant-green/80 hover:from-powerplant-green/90 hover:to-powerplant-green/70 text-white flex items-center gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <CompleteOnboarding data={data} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Step 1: Location & Climate
function LocationStep({
  data,
  setData,
  onLocationDetection,
  onZipCodeChange,
  isLoading,
  showTooltip,
  setShowTooltip,
}: any) {
  const hasPrefilledLocation = data.location.zipCode && data.location.hardinessZone
  
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-powerplant-green font-montserrat flex items-center gap-2">
          <MapPin className="w-6 h-6" />
          Where will you grow your power?
        </CardTitle>
        <p className="text-gray-600">
          {hasPrefilledLocation 
            ? "We've saved your location from the previous step. You can modify it if needed."
            : "We'll recommend plants guaranteed to thrive in your climate"
          }
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Show pre-filled location notification */}
        {hasPrefilledLocation && (
          <div className="bg-gradient-to-r from-powerplant-green/10 to-energy-yellow/10 p-4 rounded-lg border border-powerplant-green/20">
            <div className="flex items-center gap-2 text-powerplant-green font-medium">
              <CheckCircle className="w-5 h-5" />
              Location automatically set from your entry
            </div>
            <p className="text-sm text-gray-600 mt-1">
              You can change this below if needed, or continue to the next step.
            </p>
          </div>
        )}
        
        {/* Auto-detect Location */}
        <div>
          <Button
            onClick={onLocationDetection}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-lightning-blue to-lightning-blue/80 hover:from-lightning-blue/90 hover:to-lightning-blue/70 text-white"
          >
            {isLoading ? "Detecting..." : "📍 Use My Current Location"}
          </Button>
        </div>

        <div className="text-center text-gray-500">or</div>

        {/* Manual Entry */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Zip code or city
          </label>
          <input
            type="text"
            placeholder="e.g., 78701 or Austin, TX"
            value={data.location.zipCode}
            onChange={(e) => onZipCodeChange(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-powerplant-green focus:border-transparent ${
              hasPrefilledLocation ? "border-powerplant-green/50 bg-powerplant-green/5" : "border-gray-300"
            }`}
          />
        </div>

        {/* Hardiness Zone Display */}
        {data.location.hardinessZone && (
          <div className="bg-gradient-to-r from-powerplant-green/10 to-energy-yellow/10 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-powerplant-green">
                  USDA Hardiness Zone: {data.location.hardinessZone}
                </div>
                <div className="text-sm text-gray-600">
                  {data.location.city}, {data.location.state}
                </div>
              </div>
              <div className="relative">
                <Button variant="ghost" size="sm" onClick={() => setShowTooltip(!showTooltip)} className="p-1">
                  <Info className="w-4 h-4 text-powerplant-green" />
                </Button>
                {showTooltip && (
                  <div className="absolute right-0 top-8 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm z-10">
                    <strong>Why location matters:</strong> Your hardiness zone determines which plants can survive your
                    winter temperatures. We use this to recommend plants that will thrive in your climate year-round.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Map Preview Placeholder */}
        {data.location.coordinates && (
          <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-powerplant-green" />
              <div>Map preview of your area</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Step 2: Garden Space & Experience
function GardenSpaceStep({ data, setData }: any) {
  const questions = [
    {
      key: "gardenSize",
      title: "What's your garden size?",
      icon: Home,
      options: [
        { value: "container", label: "Container/Balcony", desc: "Pots and small containers" },
        { value: "small", label: "Small Garden", desc: "Up to 50 sq ft" },
        { value: "medium", label: "Medium Garden", desc: "50-500 sq ft" },
        { value: "large", label: "Large Garden", desc: "500+ sq ft" },
      ],
    },
    {
      key: "sunExposure",
      title: "How much sun does your space get?",
      icon: Sun,
      options: [
        { value: "full-sun", label: "Full Sun", desc: "6+ hours direct sunlight", icon: Sun },
        { value: "partial-sun", label: "Partial Sun", desc: "3-6 hours sunlight", icon: Cloud },
        { value: "partial-shade", label: "Partial Shade", desc: "2-4 hours sunlight", icon: CloudRain },
        { value: "full-shade", label: "Full Shade", desc: "Less than 2 hours", icon: Palette },
      ],
    },
    {
      key: "experienceLevel",
      title: "What's your gardening experience?",
      icon: Star,
      options: [
        { value: "beginner", label: "Beginner", desc: "New to gardening" },
        { value: "intermediate", label: "Intermediate", desc: "Some experience" },
        { value: "advanced", label: "Advanced", desc: "Confident gardener" },
      ],
    },
    {
      key: "maintenancePreference",
      title: "How much time can you dedicate?",
      icon: Clock,
      options: [
        { value: "low", label: "Low Maintenance", desc: "Minimal daily care" },
        { value: "moderate", label: "Moderate Care", desc: "Weekly maintenance" },
        { value: "high", label: "High Involvement", desc: "Daily gardening" },
      ],
    },
    {
      key: "budgetRange",
      title: "What's your plant budget?",
      icon: DollarSign,
      options: [
        { value: "under-50", label: "Under $50", desc: "Starting small" },
        { value: "50-150", label: "$50 - $150", desc: "Moderate investment" },
        { value: "150-300", label: "$150 - $300", desc: "Serious gardener" },
        { value: "300-plus", label: "$300+", desc: "Sky's the limit" },
      ],
    },
  ]

  const updateAnswer = (key: string, value: string) => {
    setData((prev: any) => ({
      ...prev,
      gardenSpace: {
        ...prev.gardenSpace,
        [key]: value,
      },
    }))
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-powerplant-green font-montserrat flex items-center gap-2">
          <Home className="w-6 h-6" />
          Tell us about your garden space
        </CardTitle>
        <p className="text-gray-600">This helps us recommend plants that will thrive in your specific conditions</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map((question) => (
          <div key={question.key} className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <question.icon className="w-5 h-5 text-powerplant-green" />
              <h3 className="font-semibold text-gray-900">{question.title}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {question.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateAnswer(question.key, option.value)}
                  className={`p-4 text-left border-2 rounded-lg transition-all hover:border-powerplant-green/50 ${
                    data.gardenSpace[question.key] === option.value
                      ? "border-powerplant-green bg-powerplant-green/5"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {option.icon && <option.icon className="w-4 h-4 text-powerplant-green" />}
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <div className="text-sm text-gray-600">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// Step 3: Plant Preferences
function PlantPreferencesStep({ data, setData }: any) {
  const togglePlantType = (type: string) => {
    setData((prev: any) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        plantTypes: prev.preferences.plantTypes.includes(type)
          ? prev.preferences.plantTypes.filter((t: string) => t !== type)
          : [...prev.preferences.plantTypes, type],
      },
    }))
  }

  const toggleSpecialInterest = (interest: string) => {
    setData((prev: any) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        specialInterests: prev.preferences.specialInterests.includes(interest)
          ? prev.preferences.specialInterests.filter((i: string) => i !== interest)
          : [...prev.preferences.specialInterests, interest],
      },
    }))
  }

  const setPrimaryGoal = (goal: string) => {
    setData((prev: any) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        primaryGoal: goal,
      },
    }))
  }

  const plantTypes = [
    { value: "vegetables", label: "Vegetables", icon: Carrot },
    { value: "herbs", label: "Herbs", icon: Leaf },
    { value: "flowers", label: "Flowers", icon: Flower },
    { value: "shrubs", label: "Shrubs", icon: TreePine },
  ]

  const primaryGoals = [
    { value: "food", label: "Grow Food", desc: "Vegetables and herbs for cooking" },
    { value: "beauty", label: "Beauty & Color", desc: "Flowers and ornamental plants" },
    { value: "wildlife", label: "Wildlife Habitat", desc: "Attract birds and pollinators" },
    { value: "relaxation", label: "Relaxation", desc: "Peaceful garden space" },
  ]

  const specialInterests = [
    "Native plants",
    "Pollinator-friendly",
    "Deer resistant",
    "Drought tolerant",
    "Fragrant plants",
    "Fast growing",
    "Edible flowers",
    "Medicinal herbs",
  ]

  const colorOptions = [
    { value: "vibrant", label: "Vibrant Colors", color: "bg-gradient-to-r from-red-500 to-yellow-500" },
    { value: "pastels", label: "Soft Pastels", color: "bg-gradient-to-r from-pink-200 to-purple-200" },
    { value: "white", label: "White & Cream", color: "bg-gradient-to-r from-white to-gray-100" },
    { value: "purple-blue", label: "Purple & Blue", color: "bg-gradient-to-r from-purple-500 to-blue-500" },
  ]

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-powerplant-green font-montserrat flex items-center gap-2">
          <Target className="w-6 h-6" />
          What do you want to grow?
        </CardTitle>
        <p className="text-gray-600">Tell us your preferences so we can find your perfect plants</p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Plant Types */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">What types of plants interest you? (Select all that apply)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {plantTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => togglePlantType(type.value)}
                className={`p-4 text-center border-2 rounded-lg transition-all hover:border-powerplant-green/50 ${
                  data.preferences.plantTypes.includes(type.value)
                    ? "border-powerplant-green bg-powerplant-green/5"
                    : "border-gray-200"
                }`}
              >
                <type.icon className="w-8 h-8 mx-auto mb-2 text-powerplant-green" />
                <div className="font-medium text-sm">{type.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Primary Goal */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">What's your main gardening goal?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {primaryGoals.map((goal) => (
              <button
                key={goal.value}
                onClick={() => setPrimaryGoal(goal.value)}
                className={`p-4 text-left border-2 rounded-lg transition-all hover:border-powerplant-green/50 ${
                  data.preferences.primaryGoal === goal.value
                    ? "border-powerplant-green bg-powerplant-green/5"
                    : "border-gray-200"
                }`}
              >
                <div className="font-medium">{goal.label}</div>
                <div className="text-sm text-gray-600">{goal.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Special Interests */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Special Interests (Optional)</h3>
          <div className="flex flex-wrap gap-2">
            {specialInterests.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleSpecialInterest(interest)}
                className={`px-4 py-2 rounded-full border-2 transition-all text-sm ${
                  data.preferences.specialInterests.includes(interest)
                    ? "border-powerplant-green bg-powerplant-green text-white"
                    : "border-gray-200 hover:border-powerplant-green/50"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* Color Preferences */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Color Preferences (Optional)</h3>
          <div className="grid grid-cols-2 gap-3">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                onClick={() => {
                  setData((prev: any) => ({
                    ...prev,
                    preferences: {
                      ...prev.preferences,
                      colorPreferences: prev.preferences.colorPreferences.includes(color.value)
                        ? prev.preferences.colorPreferences.filter((c: string) => c !== color.value)
                        : [...prev.preferences.colorPreferences, color.value],
                    },
                  }))
                }}
                className={`p-4 border-2 rounded-lg transition-all hover:border-powerplant-green/50 ${
                  data.preferences.colorPreferences.includes(color.value)
                    ? "border-powerplant-green"
                    : "border-gray-200"
                }`}
              >
                <div className={`w-full h-8 rounded mb-2 ${color.color}`}></div>
                <div className="font-medium text-sm">{color.label}</div>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Complete Onboarding Component
function CompleteOnboarding({ data }: any) {
  const router = useRouter()

  const handleComplete = () => {
    // Save comprehensive user profile to localStorage for results page
    const userProfile = {
      location: data.location,
      preferences: {
        // Garden space info
        gardenSize: data.gardenSpace.gardenSize,
        sunExposure: data.gardenSpace.sunExposure,
        experienceLevel: data.gardenSpace.experienceLevel,
        maintenancePreference: data.gardenSpace.maintenancePreference,
        budgetRange: data.gardenSpace.budgetRange,
        // Plant preferences
        plantTypes: data.preferences.plantTypes,
        primaryGoal: data.preferences.primaryGoal,
        specialInterests: data.preferences.specialInterests,
        colorPreferences: data.preferences.colorPreferences,
      }
    }
    
    localStorage.setItem('userProfile', JSON.stringify(userProfile))
    
    // Navigate to results page
    router.push('/results')
  }

  return (
    <Button 
      onClick={handleComplete}
      className="bg-gradient-to-r from-powerplant-green to-energy-yellow hover:from-powerplant-green/90 hover:to-energy-yellow/90 text-white font-semibold py-3 px-8 flex items-center gap-2 transform hover:scale-105 transition-all duration-200"
    >
      <Zap className="w-5 h-5" />
      Get My Plant Recommendations
    </Button>
  )
}