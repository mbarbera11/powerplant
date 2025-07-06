"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Leaf,
  MapPin,
  Sun,
  Cloud,
  Droplets,
  Star,
  Zap,
  Calendar,
  Heart,
  Share2,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  ShoppingBag,
  BookOpen,
  Users,
  CheckCircle,
  Clock,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Plant {
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
}

const mockPlants: Plant[] = [
  {
    id: "1",
    name: "Marigold",
    scientificName: "Tagetes patula",
    image: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
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
  },
  {
    id: "2",
    name: "Basil",
    scientificName: "Ocimum basilicum",
    image: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    matchScore: 5,
    sunRequirement: "full-sun",
    waterNeeds: "medium",
    careLevel: 2,
    plantType: "Herb",
    bloomTime: ["Summer"],
    peakMonths: ["July", "August", "September"],
    winterHardiness: "Annual - harvest before frost",
    priceRange: "$2-5",
    matureSize: "12-24 inches tall, 12 inches wide",
    spacing: "8-12 inches apart",
    plantingTime: ["April", "May", "June"],
    companionPlants: ["Tomatoes", "Peppers", "Marigolds"],
    commonProblems: ["Fusarium wilt", "Aphids", "Japanese beetles"],
    whyRecommended: [
      "Matches your herb growing goals",
      "Perfect for your sunny location",
      "Great for cooking and beginner-friendly",
      "Grows well with your other selections",
    ],
    features: ["Culinary herb", "Aromatic", "Fast growing", "Companion plant"],
    description:
      "Essential culinary herb with fragrant leaves perfect for cooking. Easy to grow and harvest throughout the season.",
    careInstructions: {
      watering: "Keep soil consistently moist but not waterlogged",
      fertilizing: "Light feeding monthly with balanced fertilizer",
      pruning: "Pinch flowers to keep leaves tender, harvest regularly",
      pests: "Check for aphids and Japanese beetles, hand-pick if needed",
    },
  },
  {
    id: "3",
    name: "Black-Eyed Susan",
    scientificName: "Rudbeckia hirta",
    image: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    matchScore: 4,
    sunRequirement: "full-sun",
    waterNeeds: "low",
    careLevel: 1,
    plantType: "Perennial Flower",
    bloomTime: ["Summer", "Fall"],
    peakMonths: ["July", "August", "September"],
    winterHardiness: "Hardy to Zone 3",
    priceRange: "$5-12",
    matureSize: "1-3 feet tall, 1-2 feet wide",
    spacing: "12-18 inches apart",
    plantingTime: ["March", "April", "September", "October"],
    companionPlants: ["Purple Coneflower", "Bee Balm", "Native grasses"],
    commonProblems: ["Powdery mildew", "Aphids", "Leaf spot"],
    whyRecommended: [
      "Native plant perfect for your area",
      "Extremely low maintenance",
      "Attracts beneficial pollinators",
      "Drought tolerant once established",
    ],
    features: ["Native plant", "Pollinator magnet", "Drought tolerant", "Self-seeding"],
    description:
      "Cheerful native wildflower with bright yellow petals and dark centers. Beloved by butterflies and bees.",
    careInstructions: {
      watering: "Water deeply once a week until established, then drought tolerant",
      fertilizing: "No fertilizer needed - thrives in poor soil",
      pruning: "Deadhead for more blooms, leave seed heads for birds in winter",
      pests: "Generally pest-free, may get powdery mildew in humid conditions",
    },
  },
  // Add more mock plants...
]

export default function RecommendationsPage() {
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null)
  const [filters, setFilters] = useState({
    plantType: "All types",
    sunRequirement: "All conditions",
    careLevel: "All levels",
    bloomTime: "All seasons",
    priceRange: "",
    search: "",
  })
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const plantsPerPage = 12

  const userLocation = {
    city: "Austin",
    state: "TX",
    zone: "8b",
  }

  const filteredPlants = useMemo(() => {
    return mockPlants.filter((plant) => {
      if (filters.search && !plant.name.toLowerCase().includes(filters.search.toLowerCase())) return false
      if (filters.plantType !== "All types" && plant.plantType !== filters.plantType) return false
      if (filters.sunRequirement !== "All conditions" && plant.sunRequirement !== filters.sunRequirement) return false
      if (filters.careLevel !== "All levels" && plant.careLevel.toString() !== filters.careLevel) return false
      if (filters.bloomTime !== "All seasons" && !plant.bloomTime.includes(filters.bloomTime)) return false
      return true
    })
  }, [filters])

  const paginatedPlants = useMemo(() => {
    const startIndex = (currentPage - 1) * plantsPerPage
    return filteredPlants.slice(startIndex, startIndex + plantsPerPage)
  }, [filteredPlants, currentPage])

  const totalPages = Math.ceil(filteredPlants.length / plantsPerPage)

  const toggleExpanded = (plantId: string) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(plantId)) {
      newExpanded.delete(plantId)
    } else {
      newExpanded.add(plantId)
    }
    setExpandedCards(newExpanded)
  }

  const toggleFavorite = (plantId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(plantId)) {
      newFavorites.delete(plantId)
    } else {
      newFavorites.add(plantId)
    }
    setFavorites(newFavorites)
  }

  const renderMatchScore = (score: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Zap key={i} className={`w-4 h-4 ${i < score ? "text-energy-yellow fill-energy-yellow" : "text-gray-300"}`} />
        ))}
      </div>
    )
  }

  const getSunIcon = (requirement: string) => {
    switch (requirement) {
      case "full-sun":
        return <Sun className="w-4 h-4 text-yellow-500" />
      case "partial-shade":
        return <Cloud className="w-4 h-4 text-gray-500" />
      case "full-shade":
        return <Cloud className="w-4 h-4 text-gray-600" />
      default:
        return <Sun className="w-4 h-4 text-yellow-500" />
    }
  }

  const getWaterIcon = (needs: string) => {
    const color = needs === "low" ? "text-blue-300" : needs === "medium" ? "text-blue-500" : "text-blue-700"
    return <Droplets className={`w-4 h-4 ${color}`} />
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
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Heart className="w-4 h-4" />
                Favorites ({favorites.size})
              </Button>
              <Button className="bg-gradient-to-r from-powerplant-green to-powerplant-green/80 text-white">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Shop These Plants
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-powerplant-green mb-4 font-montserrat">
            Your PowerPlant Recommendations
          </h1>
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>
                {userLocation.city}, {userLocation.state}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-powerplant-green" />
              <span>Climate Verified Zone {userLocation.zone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-energy-yellow" />
              <span>{filteredPlants.length} power plants ready to grow</span>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <div className="w-80 flex-shrink-0">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium mb-2">Search Plants</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search by name..."
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Plant Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">Plant Type</label>
                  <Select
                    value={filters.plantType}
                    onValueChange={(value) => setFilters({ ...filters, plantType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All types">All types</SelectItem>
                      <SelectItem value="Annual Flower">Annual Flowers</SelectItem>
                      <SelectItem value="Perennial Flower">Perennial Flowers</SelectItem>
                      <SelectItem value="Herb">Herbs</SelectItem>
                      <SelectItem value="Vegetable">Vegetables</SelectItem>
                      <SelectItem value="Shrub">Shrubs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sun Requirements */}
                <div>
                  <label className="block text-sm font-medium mb-2">Sun Requirements</label>
                  <Select
                    value={filters.sunRequirement}
                    onValueChange={(value) => setFilters({ ...filters, sunRequirement: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All conditions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All conditions">All conditions</SelectItem>
                      <SelectItem value="full-sun">Full Sun</SelectItem>
                      <SelectItem value="partial-shade">Partial Shade</SelectItem>
                      <SelectItem value="full-shade">Full Shade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Care Level */}
                <div>
                  <label className="block text-sm font-medium mb-2">Care Level</label>
                  <Select
                    value={filters.careLevel}
                    onValueChange={(value) => setFilters({ ...filters, careLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All levels">All levels</SelectItem>
                      <SelectItem value="1">Very Easy</SelectItem>
                      <SelectItem value="2">Easy</SelectItem>
                      <SelectItem value="3">Moderate</SelectItem>
                      <SelectItem value="4">Challenging</SelectItem>
                      <SelectItem value="5">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bloom Time */}
                <div>
                  <label className="block text-sm font-medium mb-2">Bloom Time</label>
                  <Select
                    value={filters.bloomTime}
                    onValueChange={(value) => setFilters({ ...filters, bloomTime: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All seasons" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All seasons">All seasons</SelectItem>
                      <SelectItem value="Spring">Spring</SelectItem>
                      <SelectItem value="Summer">Summer</SelectItem>
                      <SelectItem value="Fall">Fall</SelectItem>
                      <SelectItem value="Winter">Winter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Quick Filters */}
                <div>
                  <label className="block text-sm font-medium mb-2">Quick Filters</label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="native" />
                      <label htmlFor="native" className="text-sm">
                        Native Plants
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="pollinator" />
                      <label htmlFor="pollinator" className="text-sm">
                        Pollinator-Friendly
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="drought" />
                      <label htmlFor="drought" className="text-sm">
                        Drought Tolerant
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedPlants.map((plant) => (
                <PlantCard
                  key={plant.id}
                  plant={plant}
                  isExpanded={expandedCards.has(plant.id)}
                  isFavorite={favorites.has(plant.id)}
                  onToggleExpanded={() => toggleExpanded(plant.id)}
                  onToggleFavorite={() => toggleFavorite(plant.id)}
                  onViewDetails={() => setSelectedPlant(plant)}
                  renderMatchScore={renderMatchScore}
                  getSunIcon={getSunIcon}
                  getWaterIcon={getWaterIcon}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    onClick={() => setCurrentPage(i + 1)}
                    className={currentPage === i + 1 ? "bg-powerplant-green text-white" : ""}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Plant Details Modal */}
      {selectedPlant && (
        <PlantDetailsModal
          plant={selectedPlant}
          isOpen={!!selectedPlant}
          onClose={() => setSelectedPlant(null)}
          renderMatchScore={renderMatchScore}
          getSunIcon={getSunIcon}
          getWaterIcon={getWaterIcon}
        />
      )}
    </div>
  )
}

// Plant Card Component
function PlantCard({
  plant,
  isExpanded,
  isFavorite,
  onToggleExpanded,
  onToggleFavorite,
  onViewDetails,
  renderMatchScore,
  getSunIcon,
  getWaterIcon,
}: any) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white overflow-hidden">
      <div className="relative">
        <div className="aspect-square overflow-hidden">
          <Image
            src={plant.image || "/placeholder.svg"}
            alt={plant.name}
            width={300}
            height={300}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <button
          onClick={onToggleFavorite}
          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"}`} />
        </button>
        <div className="absolute top-3 left-3 flex gap-1">
          <Badge className="bg-powerplant-green text-white">{plant.plantType}</Badge>
          {plant.matchScore === 5 && (
            <Badge className="bg-energy-yellow text-powerplant-green text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              PowerPlant Guarantee
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="font-bold text-lg text-powerplant-green mb-1">{plant.name}</h3>
          <p className="text-sm text-gray-500 italic">{plant.scientificName}</p>
        </div>

        {/* Match Score */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Match Score:</span>
            {renderMatchScore(plant.matchScore)}
          </div>
          <span className="text-sm text-powerplant-green font-semibold">{plant.priceRange}</span>
        </div>

        {/* Key Features */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1">
            {getSunIcon(plant.sunRequirement)}
            <span className="text-xs text-gray-600">Sun</span>
          </div>
          <div className="flex items-center gap-1">
            {getWaterIcon(plant.waterNeeds)}
            <span className="text-xs text-gray-600">Water</span>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(plant.careLevel)].map((_, i) => (
              <Star key={i} className="w-3 h-3 text-energy-yellow fill-energy-yellow" />
            ))}
            <span className="text-xs text-gray-600">Care</span>
          </div>
        </div>

        {/* Features Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {plant.features.slice(0, 3).map((feature: string, index: number) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {feature}
            </Badge>
          ))}
        </div>

        {/* Why This Plant - Expandable */}
        <div className="border-t pt-3">
          <button
            onClick={onToggleExpanded}
            className="flex items-center justify-between w-full text-left text-sm font-medium text-powerplant-green hover:text-powerplant-green/80 transform hover:scale-105 transition-all duration-200"
          >
            Why this plant is perfect for you
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {isExpanded && (
            <div className="mt-2 space-y-1">
              {plant.whyRecommended.map((reason: string, index: number) => (
                <div key={index} className="flex items-start gap-2 text-xs text-gray-600">
                  <CheckCircle className="w-3 h-3 text-powerplant-green mt-0.5 flex-shrink-0" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <Button
            onClick={onViewDetails}
            className="flex-1 bg-gradient-to-r from-powerplant-green to-energy-yellow hover:from-powerplant-green/90 hover:to-energy-yellow/90 text-white text-sm transform hover:scale-105 transition-all duration-200"
          >
            <Zap className="w-4 h-4 mr-2" />
            Power Up Details
          </Button>
          <Button variant="outline" size="sm" className="px-3 bg-transparent">
            <MapPin className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Plant Details Modal Component
function PlantDetailsModal({ plant, isOpen, onClose, renderMatchScore, getSunIcon, getWaterIcon }: any) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-powerplant-green">{plant.name}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square mb-4 overflow-hidden rounded-lg">
              <Image
                src={plant.images[activeImageIndex] || "/placeholder.svg"}
                alt={plant.name}
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2">
              {plant.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-16 h-16 rounded border-2 overflow-hidden ${
                    activeImageIndex === index ? "border-powerplant-green" : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${plant.name} ${index + 1}`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Plant Information */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Plant Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Scientific Name:</span>
                  <span className="italic">{plant.scientificName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span>{plant.plantType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mature Size:</span>
                  <span>{plant.matureSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Spacing:</span>
                  <span>{plant.spacing}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Winter Hardiness:</span>
                  <span>{plant.winterHardiness}</span>
                </div>
              </div>
            </div>

            {/* Match Score */}
            <div>
              <h3 className="font-semibold text-lg mb-2">PowerPlant Match</h3>
              <div className="flex items-center gap-2 mb-2">
                {renderMatchScore(plant.matchScore)}
                <span className="font-semibold">Perfect Match!</span>
              </div>
              <div className="space-y-1">
                {plant.whyRecommended.map((reason: string, index: number) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-powerplant-green mt-0.5 flex-shrink-0" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Care Requirements */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Care Requirements</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  {getSunIcon(plant.sunRequirement)}
                  <div className="text-xs mt-1 capitalize">{plant.sunRequirement.replace("-", " ")}</div>
                </div>
                <div className="text-center">
                  {getWaterIcon(plant.waterNeeds)}
                  <div className="text-xs mt-1 capitalize">{plant.waterNeeds} Water</div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center">
                    {[...Array(plant.careLevel)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-energy-yellow fill-energy-yellow" />
                    ))}
                  </div>
                  <div className="text-xs mt-1">Care Level</div>
                </div>
              </div>
            </div>

            {/* Planting Timeline */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Planting Timeline</h3>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-powerplant-green" />
                <span className="text-sm">Best planting time: {plant.plantingTime.join(", ")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-powerplant-green" />
                <span className="text-sm">Peak bloom: {plant.peakMonths.join(", ")}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button className="flex-1 bg-gradient-to-r from-powerplant-green to-energy-yellow text-white">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Find at Nurseries
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                <BookOpen className="w-4 h-4 mr-2" />
                Get Growing Guide
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Detailed Care Instructions */}
        <div className="mt-6 space-y-4">
          <h3 className="font-semibold text-lg">Care Instructions</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-powerplant-green mb-1">Watering</h4>
                <p className="text-sm text-gray-600">{plant.careInstructions.watering}</p>
              </div>
              <div>
                <h4 className="font-medium text-powerplant-green mb-1">Fertilizing</h4>
                <p className="text-sm text-gray-600">{plant.careInstructions.fertilizing}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-powerplant-green mb-1">Pruning</h4>
                <p className="text-sm text-gray-600">{plant.careInstructions.pruning}</p>
              </div>
              <div>
                <h4 className="font-medium text-powerplant-green mb-1">Pest Management</h4>
                <p className="text-sm text-gray-600">{plant.careInstructions.pests}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Companion Plants */}
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-3">Plants That Grow Well Together</h3>
          <div className="flex flex-wrap gap-2">
            {plant.companionPlants.map((companion: string, index: number) => (
              <Badge key={index} variant="outline" className="border-powerplant-green text-powerplant-green">
                <Users className="w-3 h-3 mr-1" />
                {companion}
              </Badge>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
