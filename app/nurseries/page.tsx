"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Leaf,
  MapPin,
  Star,
  Phone,
  Clock,
  Globe,
  Navigation,
  Heart,
  ShoppingCart,
  Mail,
  CheckCircle,
  Search,
  List,
  Map,
  Share2,
  Printer,
  Bell,
  Award,
  Zap,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { geocodeLocation, getNearbyNurseries, type LocationCoordinates, type NurseryLocation } from "@/lib/api/maps"
import { useSearchParams } from "next/navigation"

interface Nursery {
  id: string
  name: string
  rating: number
  reviewCount: number
  distance: number
  address: string
  phone: string
  website: string
  hours: {
    [key: string]: string
  }
  specialties: string[]
  isOpen: boolean
  nextOpenTime?: string
  image: string
  photos: string[]
  description: string
  priceRange: "$" | "$$" | "$$$"
  hasRecommendedPlants: boolean
  recommendedPlantsCount: number
  isPartner: boolean
  features: string[]
  reviews: {
    id: string
    author: string
    rating: number
    text: string
    date: string
    plantsMentioned: string[]
    photos: string[]
  }[]
  promotions: string[]
  coordinates: { lat: number; lng: number }
}

const mockNurseries: Nursery[] = [
  {
    id: "1",
    name: "Green Thumb Garden Center",
    rating: 4.8,
    reviewCount: 127,
    distance: 2.3,
    address: "1234 Garden Way, Austin, TX 78701",
    phone: "(512) 555-0123",
    website: "www.greenthumbgarden.com",
    hours: {
      Monday: "8:00 AM - 6:00 PM",
      Tuesday: "8:00 AM - 6:00 PM",
      Wednesday: "8:00 AM - 6:00 PM",
      Thursday: "8:00 AM - 6:00 PM",
      Friday: "8:00 AM - 7:00 PM",
      Saturday: "7:00 AM - 7:00 PM",
      Sunday: "9:00 AM - 5:00 PM",
    },
    specialties: ["Organic Focus", "Native Plants", "Expert Advice"],
    isOpen: true,
    image: "/placeholder.svg?height=200&width=300",
    photos: [
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
    ],
    description: "Family-owned garden center specializing in native Texas plants and organic gardening supplies.",
    priceRange: "$$",
    hasRecommendedPlants: true,
    recommendedPlantsCount: 12,
    isPartner: true,
    features: ["Expert Staff", "Plant Guarantee", "Delivery Available", "Workshops"],
    reviews: [
      {
        id: "1",
        author: "Sarah M.",
        rating: 5,
        text: "Found all my marigolds and basil here! Staff was incredibly helpful with planting advice.",
        date: "2024-01-15",
        plantsMentioned: ["Marigolds", "Basil"],
        photos: ["/placeholder.svg?height=150&width=150"],
      },
      {
        id: "2",
        author: "Mike R.",
        rating: 5,
        text: "Best selection of native plants in Austin. The Black-Eyed Susans I got here are thriving!",
        date: "2024-01-10",
        plantsMentioned: ["Black-Eyed Susan"],
        photos: [],
      },
    ],
    promotions: ["15% off PowerPlant recommendations", "Free soil test with purchase"],
    coordinates: { lat: 30.2672, lng: -97.7431 },
  },
  {
    id: "2",
    name: "Austin Native Plant Society",
    rating: 4.6,
    reviewCount: 89,
    distance: 4.7,
    address: "5678 Native Trail, Austin, TX 78704",
    phone: "(512) 555-0456",
    website: "www.austinnativeplants.org",
    hours: {
      Monday: "Closed",
      Tuesday: "10:00 AM - 4:00 PM",
      Wednesday: "10:00 AM - 4:00 PM",
      Thursday: "10:00 AM - 4:00 PM",
      Friday: "10:00 AM - 4:00 PM",
      Saturday: "9:00 AM - 5:00 PM",
      Sunday: "10:00 AM - 3:00 PM",
    },
    specialties: ["Native Plants", "Rare Varieties", "Conservation"],
    isOpen: false,
    nextOpenTime: "Tuesday 10:00 AM",
    image: "/placeholder.svg?height=200&width=300",
    photos: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    description: "Non-profit organization dedicated to promoting native Texas plants and sustainable gardening.",
    priceRange: "$",
    hasRecommendedPlants: true,
    recommendedPlantsCount: 8,
    isPartner: false,
    features: ["Native Specialists", "Educational Programs", "Volunteer-Run"],
    reviews: [
      {
        id: "3",
        author: "Jennifer L.",
        rating: 5,
        text: "Amazing selection of native plants you won't find anywhere else. Very knowledgeable volunteers.",
        date: "2024-01-12",
        plantsMentioned: ["Native grasses", "Wildflowers"],
        photos: ["/placeholder.svg?height=150&width=150"],
      },
    ],
    promotions: ["Member discount available"],
    coordinates: { lat: 30.25, lng: -97.75 },
  },
  {
    id: "3",
    name: "Hill Country Gardens",
    rating: 4.4,
    reviewCount: 203,
    distance: 8.1,
    address: "9012 Hill Country Rd, Austin, TX 78746",
    phone: "(512) 555-0789",
    website: "www.hillcountrygardens.com",
    hours: {
      Monday: "9:00 AM - 6:00 PM",
      Tuesday: "9:00 AM - 6:00 PM",
      Wednesday: "9:00 AM - 6:00 PM",
      Thursday: "9:00 AM - 6:00 PM",
      Friday: "9:00 AM - 7:00 PM",
      Saturday: "8:00 AM - 7:00 PM",
      Sunday: "9:00 AM - 6:00 PM",
    },
    specialties: ["Large Selection", "Landscaping", "Seasonal Plants"],
    isOpen: true,
    image: "/placeholder.svg?height=200&width=300",
    photos: [
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
    ],
    description: "Large garden center with extensive plant selection and full landscaping services.",
    priceRange: "$$$",
    hasRecommendedPlants: true,
    recommendedPlantsCount: 15,
    isPartner: true,
    features: ["Large Selection", "Landscaping Services", "Plant Care Clinic", "Seasonal Events"],
    reviews: [
      {
        id: "4",
        author: "David K.",
        rating: 4,
        text: "Great variety but a bit pricey. Found some unique herbs here that I couldn't find elsewhere.",
        date: "2024-01-08",
        plantsMentioned: ["Herbs", "Tomatoes"],
        photos: [],
      },
    ],
    promotions: ["Spring sale - 20% off vegetables"],
    coordinates: { lat: 30.22, lng: -97.8 },
  },
]

export default function NurseriesPage() {
  const [selectedNursery, setSelectedNursery] = useState<Nursery | null>(null)
  const [viewMode, setViewMode] = useState<"map" | "list">("list")
  const [filters, setFilters] = useState({
    distance: "25",
    rating: "All",
    specialty: "All",
    priceRange: "All",
    search: "",
    openNow: false,
    hasRecommendedPlants: false,
  })
  const [shoppingList, setShoppingList] = useState<string[]>([])
  const [showShoppingList, setShowShoppingList] = useState(false)
  const [userLocation, setUserLocation] = useState<LocationCoordinates | null>(null)
  const [nurseries, setNurseries] = useState<NurseryLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [locationInput, setLocationInput] = useState("")
  
  const searchParams = useSearchParams()
  
  // Initialize location from URL params, localStorage, or default
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Try to get location from URL params first
        const category = searchParams.get('category')
        const locationParam = searchParams.get('location')
        
        // Then try localStorage
        const savedLocation = localStorage.getItem('userLocation')
        const locationToUse = locationParam || savedLocation || 'Austin, TX'
        
        setLocationInput(locationToUse)
        
        // Geocode the location
        const coordinates = await geocodeLocation(locationToUse)
        if (coordinates) {
          setUserLocation(coordinates)
          
          // Fetch nurseries for this location
          const nearbyNurseries = await getNearbyNurseries(coordinates.lat, coordinates.lng)
          setNurseries(nearbyNurseries)
          
          // Store the location for future use
          localStorage.setItem('userLocation', locationToUse)
        } else {
          throw new Error('Unable to find location')
        }
      } catch (err) {
        console.error('Error initializing location:', err)
        setError('Unable to load nurseries for this location. Please try a different location.')
        
        // Fallback to Austin, TX
        const fallbackLocation = { lat: 30.2672, lng: -97.7431, city: 'Austin', state: 'TX', formattedAddress: 'Austin, TX' }
        setUserLocation(fallbackLocation)
        setNurseries([])
      } finally {
        setLoading(false)
      }
    }
    
    initializeLocation()
  }, [searchParams])

  // Handle location search
  const handleLocationSearch = async (newLocation: string) => {
    if (!newLocation.trim()) return
    
    try {
      setLoading(true)
      setError(null)
      
      const coordinates = await geocodeLocation(newLocation)
      if (coordinates) {
        setUserLocation(coordinates)
        setLocationInput(newLocation)
        
        // Fetch nurseries for new location
        const nearbyNurseries = await getNearbyNurseries(coordinates.lat, coordinates.lng)
        setNurseries(nearbyNurseries)
        
        // Store the location
        localStorage.setItem('userLocation', newLocation)
      } else {
        setError('Location not found. Please try a different location.')
      }
    } catch (err) {
      console.error('Error searching location:', err)
      setError('Unable to search for that location. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const recommendedPlants = [
    "Marigolds (Tagetes patula)",
    "Basil (Ocimum basilicum)",
    "Black-Eyed Susan (Rudbeckia hirta)",
    "Tomatoes (Solanum lycopersicum)",
    "Lavender (Lavandula angustifolia)",
  ]

  const filteredNurseries = useMemo(() => {
    return nurseries.filter((nursery) => {
      if (filters.search && !nursery.name.toLowerCase().includes(filters.search.toLowerCase())) return false
      if (filters.distance !== "All" && nursery.distance && nursery.distance > Number.parseInt(filters.distance)) return false
      if (filters.rating !== "All" && nursery.rating < Number.parseFloat(filters.rating)) return false
      if (filters.specialty !== "All" && nursery.specialties && !nursery.specialties.includes(filters.specialty)) return false
      if (filters.priceRange !== "All") {
        const priceMap = { "$": 1, "$$": 2, "$$$": 3 }
        if (nursery.priceLevel !== priceMap[filters.priceRange as keyof typeof priceMap]) return false
      }
      if (filters.openNow && !nursery.isOpenNow) return false
      return true
    })
  }, [filters, nurseries])

  const addToShoppingList = (plant: string) => {
    if (!shoppingList.includes(plant)) {
      setShoppingList([...shoppingList, plant])
    }
  }

  const removeFromShoppingList = (plant: string) => {
    setShoppingList(shoppingList.filter((p) => p !== plant))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-powerplant-green/5 via-white to-energy-yellow/5">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-powerplant-green/10 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-powerplant-green via-energy-yellow to-lightning-blue rounded-lg flex items-center justify-center relative overflow-hidden">
                <Leaf className="w-5 h-5 text-white absolute" />
                <Zap className="w-3 h-3 text-white absolute top-1 right-1 opacity-70" />
              </div>
              <span className="text-xl font-bold text-powerplant-green font-montserrat">PowerPlant</span>
            </Link>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowShoppingList(true)}
                className="flex items-center gap-2 bg-transparent"
              >
                <ShoppingCart className="w-4 h-4" />
                Shopping List ({shoppingList.length})
              </Button>
              <Button className="bg-gradient-to-r from-powerplant-green to-powerplant-green/80 text-white">
                <Navigation className="w-4 h-4 mr-2" />
                Get Directions
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-powerplant-green mb-4 font-montserrat">Power Up at Local Nurseries</h1>
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>
                {userLocation ? `${userLocation.city}, ${userLocation.state}` : 'Loading location...'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-powerplant-green" />
              <span>PowerPlant Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-energy-yellow" />
              <span>{filteredNurseries.length} power nurseries ready to help</span>
            </div>
          </div>
        </div>

        {/* View Toggle and Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex items-center gap-4">
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "map" | "list")}>
              <TabsList>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List className="w-4 h-4" />
                  List View
                </TabsTrigger>
                <TabsTrigger value="map" className="flex items-center gap-2">
                  <Map className="w-4 h-4" />
                  Map View
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex flex-wrap gap-4 flex-1">
            {/* Location Input */}
            <div className="relative min-w-64">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Enter your address or city..."
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLocationSearch(locationInput)}
                className="pl-10"
              />
              {locationInput !== (userLocation?.formattedAddress || '') && (
                <Button
                  size="sm"
                  onClick={() => handleLocationSearch(locationInput)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 px-3 bg-powerplant-green text-white"
                >
                  Search
                </Button>
              )}
            </div>
            
            {/* Search */}
            <div className="relative min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search nurseries or plants..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>

            {/* Distance Filter */}
            <Select value={filters.distance} onValueChange={(value) => setFilters({ ...filters, distance: value })}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Distance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 miles</SelectItem>
                <SelectItem value="10">10 miles</SelectItem>
                <SelectItem value="25">25 miles</SelectItem>
                <SelectItem value="50">50 miles</SelectItem>
              </SelectContent>
            </Select>

            {/* Rating Filter */}
            <Select value={filters.rating} onValueChange={(value) => setFilters({ ...filters, rating: value })}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Ratings</SelectItem>
                <SelectItem value="4.5">4.5+ Stars</SelectItem>
                <SelectItem value="4.0">4.0+ Stars</SelectItem>
                <SelectItem value="3.5">3.5+ Stars</SelectItem>
              </SelectContent>
            </Select>

            {/* Quick Filters */}
            <div className="flex gap-2">
              <Button
                variant={filters.openNow ? "default" : "outline"}
                size="sm"
                onClick={() => setFilters({ ...filters, openNow: !filters.openNow })}
                className={filters.openNow ? "bg-powerplant-green text-white" : "bg-transparent"}
              >
                Open Now
              </Button>
              <Button
                variant={filters.hasRecommendedPlants ? "default" : "outline"}
                size="sm"
                onClick={() => setFilters({ ...filters, hasRecommendedPlants: !filters.hasRecommendedPlants })}
                className={filters.hasRecommendedPlants ? "bg-powerplant-green text-white" : "bg-transparent"}
              >
                Has My Plants
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-powerplant-green mx-auto mb-4"></div>
              <p className="text-gray-600">Finding the best nurseries in your area...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-red-500 text-lg font-semibold mb-2">Oops! Something went wrong</div>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => handleLocationSearch(locationInput)} className="bg-powerplant-green text-white">
                Try Again
              </Button>
            </div>
          </div>
        ) : filteredNurseries.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-gray-500 text-lg font-semibold mb-2">No nurseries found</div>
              <p className="text-gray-600 mb-4">Try adjusting your filters or search in a different location.</p>
              <Button onClick={() => setFilters({
                distance: "25", rating: "All", specialty: "All", priceRange: "All",
                search: "", openNow: false, hasRecommendedPlants: false
              })} variant="outline">
                Clear Filters
              </Button>
            </div>
          </div>
        ) : viewMode === "list" ? (
          <div className="space-y-6">
            {filteredNurseries.map((nursery) => (
              <NurseryCard
                key={nursery.id}
                nursery={nursery}
                onViewDetails={() => setSelectedNursery(nursery)}
                recommendedPlants={recommendedPlants}
                onAddToShoppingList={addToShoppingList}
              />
            ))}
          </div>
        ) : (
          <MapView nurseries={filteredNurseries} userLocation={userLocation} onSelectNursery={setSelectedNursery} />
        )}
      </div>

      {/* Nursery Details Modal */}
      {selectedNursery && (
        <NurseryDetailsModal
          nursery={selectedNursery}
          isOpen={!!selectedNursery}
          onClose={() => setSelectedNursery(null)}
          recommendedPlants={recommendedPlants}
          onAddToShoppingList={addToShoppingList}
        />
      )}

      {/* Shopping List Modal */}
      {showShoppingList && (
        <ShoppingListModal
          plants={shoppingList}
          nurseries={filteredNurseries}
          isOpen={showShoppingList}
          onClose={() => setShowShoppingList(false)}
          onRemovePlant={removeFromShoppingList}
        />
      )}
    </div>
  )
}

// Nursery Card Component
function NurseryCard({ nursery, onViewDetails, recommendedPlants, onAddToShoppingList }: any) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < Math.floor(rating) ? "text-energy-yellow fill-energy-yellow" : "text-gray-300"}`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">
          {rating} ({nursery.reviews?.length || 0})
        </span>
      </div>
    )
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white">
      <CardContent className="p-6">
        <div className="flex gap-6">
          {/* Image */}
          <div className="w-48 h-32 flex-shrink-0 overflow-hidden rounded-lg">
            <Image
              src={nursery.photos?.[0] || "/placeholder.svg"}
              alt={nursery.name}
              width={192}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-powerplant-green">{nursery.name}</h3>
                  {nursery.rating > 4.5 && (
                    <Badge className="bg-energy-yellow text-powerplant-green">
                      <Award className="w-3 h-3 mr-1" />
                      Highly Rated
                    </Badge>
                  )}
                </div>
                {renderStars(nursery.rating)}
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-powerplant-green">{nursery.distance?.toFixed(1)} mi</div>
                <div className="text-sm text-gray-600">
                  {nursery.priceLevel ? "$".repeat(nursery.priceLevel) : "$$"}
                </div>
              </div>
            </div>

            {/* Address and Status */}
            <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{nursery.address}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {nursery.isOpenNow ? (
                  <span className="text-green-600 font-medium">Open Now</span>
                ) : (
                  <span className="text-red-600">Closed</span>
                )}
              </div>
            </div>

            {/* Specialties */}
            <div className="flex flex-wrap gap-2 mb-3">
              {nursery.specialties?.map((specialty, index) => (
                <Badge key={index} variant="outline" className="border-powerplant-green text-powerplant-green">
                  {specialty}
                </Badge>
              )) || <Badge variant="outline" className="border-powerplant-green text-powerplant-green">General Plants</Badge>}
            </div>

            {/* Recommended Plants Indicator */}
            {nursery.specialties?.some(s => s.toLowerCase().includes('native') || s.toLowerCase().includes('organic')) && (
              <div className="flex items-center gap-2 mb-3 p-2 bg-gradient-to-r from-powerplant-green/10 to-energy-yellow/10 rounded-lg border border-powerplant-green/20">
                <Zap className="w-4 h-4 text-energy-yellow" />
                <span className="text-sm text-powerplant-green font-medium">
                  PowerPlant Verified: Specializes in sustainable plants
                </span>
              </div>
            )}

            {/* Contact Info */}
            <div className="mb-3 flex gap-4 text-sm text-gray-600">
              {nursery.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span>{nursery.phone}</span>
                </div>
              )}
              {nursery.website && (
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <span>Website</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={onViewDetails}
                className="bg-gradient-to-r from-powerplant-green to-energy-yellow hover:from-powerplant-green/90 hover:to-energy-yellow/90 text-white transform hover:scale-105 transition-all duration-200"
              >
                <Zap className="w-4 h-4 mr-2" />
                Power Up Here
              </Button>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Phone className="w-4 h-4" />
                Call
              </Button>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Navigation className="w-4 h-4" />
                Directions
              </Button>
              <Button
                variant="outline"
                onClick={() => recommendedPlants.forEach(onAddToShoppingList)}
                className="flex items-center gap-2 bg-transparent"
              >
                <ShoppingCart className="w-4 h-4" />
                Add Plants
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Map View Component
function MapView({ nurseries, userLocation, onSelectNursery }: any) {
  return (
    <Card className="h-96 border-0 shadow-lg">
      <CardContent className="p-0 h-full">
        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
          {/* Mock Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100"></div>

          {/* User Location */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
            <div className="text-xs text-center mt-1 font-medium">You</div>
          </div>

          {/* Nursery Markers */}
          {nurseries.map((nursery: any, index: number) => (
            <button
              key={nursery.id}
              onClick={() => onSelectNursery(nursery)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
              style={{
                top: `${40 + index * 15}%`,
                left: `${30 + index * 20}%`,
              }}
            >
              <div className="w-6 h-6 bg-powerplant-green rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <Leaf className="w-3 h-3 text-white" />
              </div>
              <div className="text-xs text-center mt-1 font-medium max-w-20 truncate">{nursery.name}</div>
            </button>
          ))}

          {/* Map Controls */}
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2">
            <div className="text-sm font-medium text-gray-700">Interactive Map</div>
            <div className="text-xs text-gray-500">Click markers for details</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Nursery Details Modal
function NurseryDetailsModal({ nursery, isOpen, onClose, recommendedPlants, onAddToShoppingList }: any) {
  const [activeTab, setActiveTab] = useState("overview")

  const callScript = `Hi, I'm calling to check if you have any of these plants in stock: ${recommendedPlants
    .slice(0, 3)
    .join(", ")}. I found your nursery through PowerPlant recommendations.`

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-powerplant-green flex items-center gap-2">
            {nursery.name}
            {nursery.isPartner && (
              <Badge className="bg-energy-yellow text-powerplant-green">
                <Award className="w-3 h-3 mr-1" />
                Partner
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="plants">Plants</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-powerplant-green" />
                    <span className="text-sm">{nursery.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-powerplant-green" />
                    <span className="text-sm">{nursery.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-powerplant-green" />
                    <a href={`https://${nursery.website}`} className="text-sm text-blue-600 hover:underline">
                      {nursery.website}
                    </a>
                  </div>
                </div>

                {/* Call Script */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Call Script:</h4>
                  <p className="text-sm text-gray-600 italic">"{callScript}"</p>
                  <Button size="sm" className="mt-2 bg-powerplant-green text-white">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Store Hours</h3>
                <div className="space-y-1">
                  {Object.entries(nursery.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="font-medium">{day}:</span>
                      <span className={hours === "Closed" ? "text-red-600" : ""}>{hours}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                      nursery.isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    {nursery.isOpen ? "Open Now" : `Closed • Opens ${nursery.nextOpenTime}`}
                  </div>
                </div>
              </div>
            </div>

            {/* Features and Specialties */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Specialties & Features</h3>
              <div className="flex flex-wrap gap-2">
                {[...nursery.specialties, ...nursery.features].map((item, index) => (
                  <Badge key={index} variant="outline" className="border-powerplant-green text-powerplant-green">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Promotions */}
            {nursery.promotions.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Current Promotions</h3>
                <div className="space-y-2">
                  {nursery.promotions.map((promotion, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-energy-yellow/10 rounded-lg">
                      <Zap className="w-4 h-4 text-energy-yellow" />
                      <span className="text-sm font-medium">{promotion}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="plants" className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-3">Your Recommended Plants</h3>
              <div className="space-y-3">
                {recommendedPlants.map((plant: string, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">{plant}</span>
                      <div className="text-sm text-gray-600">Likely in stock</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="bg-transparent">
                        <Bell className="w-4 h-4 mr-1" />
                        Notify
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => onAddToShoppingList(plant)}
                        className="bg-powerplant-green text-white"
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            {nursery.reviews.map((review: any) => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{review.author}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? "text-energy-yellow fill-energy-yellow" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{review.text}</p>
                {review.plantsMentioned.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {review.plantsMentioned.map((plant, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {plant}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="photos" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {nursery.photos.map((photo: string, index: number) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={photo || "/placeholder.svg"}
                    alt={`${nursery.name} photo ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button className="flex-1 bg-gradient-to-r from-powerplant-green to-energy-yellow text-white">
            <Navigation className="w-4 h-4 mr-2" />
            Get Directions
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            <Phone className="w-4 h-4 mr-2" />
            Call Nursery
          </Button>
          <Button variant="outline" className="bg-transparent">
            <Heart className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="bg-transparent">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Shopping List Modal
function ShoppingListModal({ plants, nurseries, isOpen, onClose, onRemovePlant }: any) {
  const [selectedNurseries, setSelectedNurseries] = useState<string[]>([])

  const toggleNursery = (nurseryId: string) => {
    setSelectedNurseries((prev) =>
      prev.includes(nurseryId) ? prev.filter((id) => id !== nurseryId) : [...prev, nurseryId],
    )
  }

  const generateEmailBody = () => {
    const plantList = plants.map((plant: string, index: number) => `${index + 1}. ${plant}`).join("\n")
    return `Hello,\n\nI'm interested in purchasing the following plants:\n\n${plantList}\n\nCould you please let me know about availability and pricing?\n\nThank you!\n\nSent via PowerPlant`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-powerplant-green">My Shopping List</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plant List */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Plants ({plants.length})</h3>
            {plants.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No plants in your shopping list yet.</p>
            ) : (
              <div className="space-y-2">
                {plants.map((plant: string, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">{plant}</span>
                    <Button size="sm" variant="outline" onClick={() => onRemovePlant(plant)}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nursery Selection */}
          {plants.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Send to Nurseries</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {nurseries.map((nursery: any) => (
                  <div key={nursery.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <span className="font-medium">{nursery.name}</span>
                      <div className="text-sm text-gray-600">{nursery.distance} mi away</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedNurseries.includes(nursery.id)}
                      onChange={() => toggleNursery(nursery.id)}
                      className="w-4 h-4 text-powerplant-green"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {plants.length > 0 && (
            <div className="flex gap-3">
              <Button className="flex-1 bg-gradient-to-r from-powerplant-green to-energy-yellow text-white">
                <Mail className="w-4 h-4 mr-2" />
                Email to Selected ({selectedNurseries.length})
              </Button>
              <Button variant="outline" className="bg-transparent">
                <Printer className="w-4 h-4 mr-2" />
                Print List
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
