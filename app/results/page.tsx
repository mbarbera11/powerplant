"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Leaf,
  Star,
  MapPin,
  Sun,
  Droplets,
  Calendar,
  DollarSign,
  Clock,
  Info,
  Heart,
  Share2,
  ShoppingCart,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Thermometer,
  Cloud,
  Zap,
  Filter,
  SortAsc,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface PlantRecommendation {
  id: string
  name: string
  scientificName: string
  category: string
  matchScore: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  sunRequirement: string
  waterRequirement: string
  plantingTime: string
  harvestTime?: string
  price: string
  description: string
  benefits: string[]
  careInstructions: string[]
  commonIssues: string[]
  companionPlants: string[]
  image: string
  tags: string[]
}

interface UserProfile {
  location: {
    city: string
    state: string
    zipCode: string
    hardinessZone: string
  }
  preferences: {
    gardenSize: string
    sunExposure: string
    experienceLevel: string
    primaryGoal: string
    maintenancePreference: string
    budgetRange: string
    plantTypes: string[]
    specialInterests: string[]
  }
}

export default function ResultsPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [recommendations, setRecommendations] = useState<PlantRecommendation[]>([])
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('match')
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadUserProfile()
    generateRecommendations()
  }, [])

  const loadUserProfile = () => {
    // Load user profile from localStorage or API
    const savedProfile = localStorage.getItem('userProfile')
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile))
    } else {
      // Redirect to onboarding if no profile
      router.push('/onboarding')
    }
  }

  const generateRecommendations = () => {
    setIsLoading(true)
    
    // Generate personalized recommendations based on user profile
    const allPlants: PlantRecommendation[] = [
      // Vegetables
      {
        id: '1',
        name: 'Cherry Tomatoes',
        scientificName: 'Solanum lycopersicum',
        category: 'Vegetables',
        matchScore: 0,
        difficulty: 'Medium',
        sunRequirement: 'Full Sun',
        waterRequirement: 'Regular',
        plantingTime: 'Spring after last frost',
        harvestTime: '70-80 days',
        price: '$12-18',
        description: 'Sweet, bite-sized tomatoes perfect for snacking and salads.',
        benefits: ['High yield', 'Continuous harvest', 'Nutritious', 'Versatile use'],
        careInstructions: [
          'Provide support with cages or stakes',
          'Water consistently to prevent splitting',
          'Mulch around plants to retain moisture',
          'Prune suckers for better fruit production'
        ],
        commonIssues: ['Blossom end rot from inconsistent watering', 'Hornworms'],
        companionPlants: ['Basil', 'Marigolds', 'Peppers', 'Carrots'],
        image: '/placeholder.jpg',
        tags: ['Productive', 'Nutritious', 'Summer harvest', 'Needs support']
      },
      {
        id: '2',
        name: 'Lettuce',
        scientificName: 'Lactuca sativa',
        category: 'Vegetables',
        matchScore: 0,
        difficulty: 'Easy',
        sunRequirement: 'Partial Sun',
        waterRequirement: 'Regular',
        plantingTime: 'Spring and fall',
        harvestTime: '45-65 days',
        price: '$4-8',
        description: 'Fresh, crisp greens perfect for salads and sandwiches.',
        benefits: ['Quick harvest', 'Nutritious', 'Cool weather crop', 'Space efficient'],
        careInstructions: [
          'Plant in cool weather',
          'Keep soil consistently moist',
          'Harvest outer leaves first',
          'Provide shade in hot weather'
        ],
        commonIssues: ['Bolting in hot weather', 'Slugs and snails'],
        companionPlants: ['Carrots', 'Radishes', 'Chives', 'Garlic'],
        image: '/placeholder.jpg',
        tags: ['Fast-growing', 'Cool season', 'Beginner-friendly', 'Nutritious']
      },
      {
        id: '3',
        name: 'Bell Peppers',
        scientificName: 'Capsicum annuum',
        category: 'Vegetables',
        matchScore: 0,
        difficulty: 'Medium',
        sunRequirement: 'Full Sun',
        waterRequirement: 'Regular',
        plantingTime: 'Spring after soil warms',
        harvestTime: '70-85 days',
        price: '$8-15',
        description: 'Sweet, crunchy peppers in various colors, perfect for cooking.',
        benefits: ['Colorful harvest', 'Nutritious', 'Versatile cooking', 'Long season'],
        careInstructions: [
          'Plant in warm soil',
          'Provide consistent moisture',
          'Support heavy plants',
          'Harvest when full size'
        ],
        commonIssues: ['Blossom end rot', 'Pepper maggots'],
        companionPlants: ['Tomatoes', 'Basil', 'Onions', 'Parsley'],
        image: '/placeholder.jpg',
        tags: ['Colorful', 'Nutritious', 'Heat-loving', 'Long harvest']
      },
      // Herbs
      {
        id: '4',
        name: 'Sweet Basil',
        scientificName: 'Ocimum basilicum',
        category: 'Herbs',
        matchScore: 0,
        difficulty: 'Easy',
        sunRequirement: 'Full Sun',
        waterRequirement: 'Moderate',
        plantingTime: 'Spring after soil warms',
        harvestTime: 'Continuous harvest',
        price: '$6-10',
        description: 'Aromatic herb perfect for cooking, with fresh leaves that enhance any dish.',
        benefits: ['Culinary use', 'Aromatic', 'Attracts pollinators', 'Natural pest repellent'],
        careInstructions: [
          'Plant in rich, well-draining soil',
          'Pinch flowers to encourage leaf growth',
          'Harvest regularly for best flavor',
          'Protect from cold temperatures'
        ],
        commonIssues: ['Fusarium wilt in humid conditions', 'Aphids and spider mites'],
        companionPlants: ['Tomatoes', 'Peppers', 'Oregano', 'Marigolds'],
        image: '/placeholder.jpg',
        tags: ['Culinary', 'Aromatic', 'Heat-loving', 'Continuous harvest']
      },
      {
        id: '5',
        name: 'Rosemary',
        scientificName: 'Rosmarinus officinalis',
        category: 'Herbs',
        matchScore: 0,
        difficulty: 'Easy',
        sunRequirement: 'Full Sun',
        waterRequirement: 'Low',
        plantingTime: 'Spring or fall',
        harvestTime: 'Year-round',
        price: '$12-20',
        description: 'Fragrant evergreen herb with needle-like leaves, perfect for Mediterranean cooking.',
        benefits: ['Drought tolerant', 'Evergreen', 'Aromatic', 'Medicinal properties'],
        careInstructions: [
          'Plant in well-draining soil',
          'Avoid overwatering',
          'Prune to maintain shape',
          'Harvest sprigs as needed'
        ],
        commonIssues: ['Root rot in wet conditions', 'Powdery mildew'],
        companionPlants: ['Lavender', 'Sage', 'Thyme', 'Carrots'],
        image: '/placeholder.jpg',
        tags: ['Drought-tolerant', 'Evergreen', 'Aromatic', 'Low-maintenance']
      },
      {
        id: '6',
        name: 'Mint',
        scientificName: 'Mentha spicata',
        category: 'Herbs',
        matchScore: 0,
        difficulty: 'Easy',
        sunRequirement: 'Partial Sun',
        waterRequirement: 'Regular',
        plantingTime: 'Spring',
        harvestTime: 'Continuous harvest',
        price: '$6-12',
        description: 'Fast-growing herb with refreshing flavor, perfect for teas and cooking.',
        benefits: ['Fast growing', 'Refreshing', 'Medicinal', 'Spreads easily'],
        careInstructions: [
          'Plant in containers to control spread',
          'Keep soil consistently moist',
          'Harvest regularly to prevent flowering',
          'Divide plants annually'
        ],
        commonIssues: ['Invasive spreading', 'Rust disease'],
        companionPlants: ['Tomatoes', 'Cabbage', 'Peas', 'Broccoli'],
        image: '/placeholder.jpg',
        tags: ['Fast-growing', 'Refreshing', 'Medicinal', 'Spreads easily']
      },
      // Flowers
      {
        id: '7',
        name: 'Marigolds',
        scientificName: 'Tagetes patula',
        category: 'Flowers',
        matchScore: 0,
        difficulty: 'Easy',
        sunRequirement: 'Full Sun',
        waterRequirement: 'Moderate',
        plantingTime: 'Spring after last frost',
        harvestTime: 'Summer to fall',
        price: '$8-12',
        description: 'Bright, cheerful flowers that bloom all season long and naturally repel pests.',
        benefits: ['Pest deterrent', 'Attracts beneficial insects', 'Edible flowers', 'Low maintenance'],
        careInstructions: [
          'Plant in well-draining soil',
          'Water when top inch of soil is dry',
          'Deadhead spent blooms for continuous flowering',
          'Fertilize monthly with balanced fertilizer'
        ],
        commonIssues: ['Overwatering can cause root rot', 'Aphids may appear in hot weather'],
        companionPlants: ['Tomatoes', 'Peppers', 'Basil', 'Nasturtiums'],
        image: '/placeholder.jpg',
        tags: ['Beginner-friendly', 'Pest control', 'Colorful', 'Heat-tolerant']
      },
      {
        id: '8',
        name: 'Sunflowers',
        scientificName: 'Helianthus annuus',
        category: 'Flowers',
        matchScore: 0,
        difficulty: 'Easy',
        sunRequirement: 'Full Sun',
        waterRequirement: 'Moderate',
        plantingTime: 'Late spring',
        harvestTime: 'Fall',
        price: '$10-15',
        description: 'Tall, cheerful flowers that follow the sun and attract beneficial wildlife.',
        benefits: ['Attracts birds', 'Edible seeds', 'Natural windbreak', 'Soil improvement'],
        careInstructions: [
          'Plant in deep, well-draining soil',
          'Provide support for tall varieties',
          'Water deeply but infrequently',
          'Protect from strong winds'
        ],
        commonIssues: ['Stem rot in wet conditions', 'Birds may eat seeds'],
        companionPlants: ['Corn', 'Beans', 'Squash', 'Nasturtiums'],
        image: '/placeholder.jpg',
        tags: ['Wildlife-friendly', 'Tall', 'Edible seeds', 'Summer bloomer']
      },
      {
        id: '9',
        name: 'Zinnias',
        scientificName: 'Zinnia elegans',
        category: 'Flowers',
        matchScore: 0,
        difficulty: 'Easy',
        sunRequirement: 'Full Sun',
        waterRequirement: 'Moderate',
        plantingTime: 'Spring after last frost',
        harvestTime: 'Summer to fall',
        price: '$6-10',
        description: 'Vibrant, long-lasting flowers in many colors that attract butterflies.',
        benefits: ['Attracts butterflies', 'Cut flowers', 'Drought tolerant', 'Easy care'],
        careInstructions: [
          'Plant in well-draining soil',
          'Water at soil level to prevent disease',
          'Deadhead for continuous blooms',
          'Provide good air circulation'
        ],
        commonIssues: ['Powdery mildew', 'Bacterial wilt'],
        companionPlants: ['Tomatoes', 'Basil', 'Peppers', 'Cucumbers'],
        image: '/placeholder.jpg',
        tags: ['Butterfly magnet', 'Colorful', 'Cut flowers', 'Heat-tolerant']
      },
      // Shrubs
      {
        id: '10',
        name: 'Lavender',
        scientificName: 'Lavandula angustifolia',
        category: 'Shrubs',
        matchScore: 0,
        difficulty: 'Easy',
        sunRequirement: 'Full Sun',
        waterRequirement: 'Low',
        plantingTime: 'Spring or fall',
        harvestTime: 'Summer',
        price: '$15-25',
        description: 'Fragrant perennial herb with beautiful purple flowers and calming properties.',
        benefits: ['Drought tolerant', 'Attracts bees', 'Aromatic', 'Natural pest deterrent'],
        careInstructions: [
          'Plant in well-draining soil',
          'Avoid overwatering',
          'Prune after flowering',
          'Harvest before peak heat'
        ],
        commonIssues: ['Root rot in wet conditions', 'May struggle in humid climates'],
        companionPlants: ['Rosemary', 'Sage', 'Thyme', 'Roses'],
        image: '/placeholder.jpg',
        tags: ['Drought-tolerant', 'Fragrant', 'Perennial', 'Low-maintenance']
      },
      {
        id: '11',
        name: 'Boxwood',
        scientificName: 'Buxus sempervirens',
        category: 'Shrubs',
        matchScore: 0,
        difficulty: 'Medium',
        sunRequirement: 'Partial Sun',
        waterRequirement: 'Moderate',
        plantingTime: 'Spring or fall',
        harvestTime: 'N/A',
        price: '$25-40',
        description: 'Classic evergreen shrub perfect for hedges and topiary.',
        benefits: ['Evergreen', 'Formal appearance', 'Deer resistant', 'Shape retention'],
        careInstructions: [
          'Plant in well-draining soil',
          'Prune in late winter',
          'Mulch to retain moisture',
          'Protect from harsh winds'
        ],
        commonIssues: ['Boxwood blight', 'Leafminer'],
        companionPlants: ['Roses', 'Hydrangeas', 'Hostas', 'Ferns'],
        image: '/placeholder.jpg',
        tags: ['Evergreen', 'Formal', 'Deer resistant', 'Low-maintenance']
      },
      {
        id: '12',
        name: 'Hydrangea',
        scientificName: 'Hydrangea macrophylla',
        category: 'Shrubs',
        matchScore: 0,
        difficulty: 'Medium',
        sunRequirement: 'Partial Shade',
        waterRequirement: 'Regular',
        plantingTime: 'Spring or fall',
        harvestTime: 'Summer',
        price: '$20-35',
        description: 'Large, showy flower clusters that change color based on soil pH.',
        benefits: ['Large blooms', 'Color changing', 'Shade tolerant', 'Cut flowers'],
        careInstructions: [
          'Plant in morning sun, afternoon shade',
          'Keep soil consistently moist',
          'Mulch heavily around base',
          'Prune after flowering'
        ],
        commonIssues: ['Leaf scorch in too much sun', 'Powdery mildew'],
        companionPlants: ['Hostas', 'Astilbe', 'Ferns', 'Impatiens'],
        image: '/placeholder.jpg',
        tags: ['Large blooms', 'Shade tolerant', 'Color changing', 'Cut flowers']
      }
    ]

    // Calculate match scores based on user preferences
    const personalizedRecommendations = allPlants.map(plant => {
      let score = 0
      
      if (!userProfile) {
        plant.matchScore = 50
        return plant
      }
      
      // Match plant types (40% of score)
      if (userProfile.preferences.plantTypes.includes(plant.category.toLowerCase()) || 
          userProfile.preferences.plantTypes.some(type => plant.category.toLowerCase().includes(type))) {
        score += 40
      }
      
      // Match sun requirements (25% of score)
      const userSun = userProfile.preferences.sunExposure
      const plantSun = plant.sunRequirement
      if (
        (userSun === 'full-sun' && plantSun === 'Full Sun') ||
        (userSun === 'partial-sun' && (plantSun === 'Partial Sun' || plantSun === 'Full Sun')) ||
        (userSun === 'partial-shade' && (plantSun === 'Partial Shade' || plantSun === 'Partial Sun')) ||
        (userSun === 'full-shade' && plantSun === 'Partial Shade')
      ) {
        score += 25
      }
      
      // Match experience level (20% of score)
      const userExperience = userProfile.preferences.experienceLevel
      const plantDifficulty = plant.difficulty
      if (
        (userExperience === 'beginner' && plantDifficulty === 'Easy') ||
        (userExperience === 'intermediate' && (plantDifficulty === 'Easy' || plantDifficulty === 'Medium')) ||
        (userExperience === 'advanced')
      ) {
        score += 20
      }
      
      // Match primary goal (10% of score)
      const primaryGoal = userProfile.preferences.primaryGoal
      if (
        (primaryGoal === 'food' && (plant.category === 'Vegetables' || plant.category === 'Herbs')) ||
        (primaryGoal === 'beauty' && plant.category === 'Flowers') ||
        (primaryGoal === 'wildlife' && plant.tags.some(tag => tag.includes('Wildlife') || tag.includes('Butterfly') || tag.includes('Pollinator'))) ||
        (primaryGoal === 'relaxation' && plant.tags.some(tag => tag.includes('Fragrant') || tag.includes('Aromatic')))
      ) {
        score += 10
      }
      
      // Match special interests (5% of score)
      const specialInterests = userProfile.preferences.specialInterests
      if (specialInterests.some(interest => 
        plant.tags.some(tag => tag.toLowerCase().includes(interest.toLowerCase().split(' ')[0])) ||
        plant.benefits.some(benefit => benefit.toLowerCase().includes(interest.toLowerCase().split(' ')[0]))
      )) {
        score += 5
      }
      
      plant.matchScore = Math.min(Math.max(score, 10), 100) // Keep between 10-100
      return plant
    })
    
    // Sort by match score and take top recommendations
    const sortedRecommendations = personalizedRecommendations
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 8) // Show top 8 recommendations
    
    // Simulate API delay
    setTimeout(() => {
      setRecommendations(sortedRecommendations)
      setIsLoading(false)
    }, 1000)
  }

  const filteredRecommendations = recommendations
    .filter(plant => selectedCategory === 'all' || plant.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'match':
          return b.matchScore - a.matchScore
        case 'difficulty':
          const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 }
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  const toggleFavorite = (plantId: string) => {
    setFavoriteIds(prev => 
      prev.includes(plantId) 
        ? prev.filter(id => id !== plantId)
        : [...prev, plantId]
    )
  }

  const categories = ['all', ...Array.from(new Set(recommendations.map(r => r.category)))]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-powerplant-green/5 via-white to-energy-yellow/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-powerplant-green to-energy-yellow rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-powerplant-green mb-2">Powering up your recommendations...</h2>
          <p className="text-gray-600">Finding the perfect plants for your garden</p>
        </div>
      </div>
    )
  }

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
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => router.push('/onboarding')}>
              <Settings className="w-4 h-4 mr-2" />
              Retake Quiz
            </Button>
            <Button size="sm" onClick={() => router.push('/nurseries')}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Find Nurseries
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-8 h-8 text-energy-yellow" />
            <h1 className="text-4xl font-bold text-powerplant-green font-montserrat">Your Plant Power Results</h1>
          </div>
          <p className="text-xl text-gray-600 mb-6">
            {recommendations.length} personalized plant recommendations for your {userProfile?.location.city} garden
          </p>
          
          {/* User Profile Summary */}
          {userProfile && (
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-powerplant-green mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Location</h3>
                  <p className="text-gray-600">{userProfile.location.city}, {userProfile.location.state}</p>
                  <p className="text-sm text-gray-500">Zone {userProfile.location.hardinessZone}</p>
                </div>
                <div className="text-center">
                  <Sun className="w-8 h-8 text-energy-yellow mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Garden Space</h3>
                  <p className="text-gray-600">{userProfile.preferences.gardenSize}</p>
                  <p className="text-sm text-gray-500">{userProfile.preferences.sunExposure}</p>
                </div>
                <div className="text-center">
                  <Leaf className="w-8 h-8 text-powerplant-green mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Experience</h3>
                  <p className="text-gray-600">{userProfile.preferences.experienceLevel}</p>
                  <p className="text-sm text-gray-500">{userProfile.preferences.primaryGoal}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-powerplant-green focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <SortAsc className="w-5 h-5 text-gray-600" />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-powerplant-green focus:border-transparent"
            >
              <option value="match">Best Match</option>
              <option value="difficulty">Difficulty</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {/* Plant Recommendations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecommendations.map((plant) => (
            <PlantCard 
              key={plant.id} 
              plant={plant} 
              isFavorite={favoriteIds.includes(plant.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-powerplant-green to-energy-yellow rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to grow your power?</h2>
            <p className="text-xl mb-6">Find local nurseries with your recommended plants</p>
            <Button 
              size="lg" 
              onClick={() => router.push('/nurseries')}
              className="bg-white text-powerplant-green hover:bg-gray-100 font-semibold px-8"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Find Nurseries Near You
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PlantCard({ plant, isFavorite, onToggleFavorite }: {
  plant: PlantRecommendation
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-powerplant-green mb-1">{plant.name}</CardTitle>
            <p className="text-sm text-gray-600 italic">{plant.scientificName}</p>
            <Badge className="mt-2 bg-powerplant-green/10 text-powerplant-green hover:bg-powerplant-green/20">
              {plant.category}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleFavorite(plant.id)}
              className="p-2"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
            </Button>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-energy-yellow fill-energy-yellow" />
                <span className="font-bold text-powerplant-green">{plant.matchScore}%</span>
              </div>
              <span className="text-xs text-gray-500">match</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-700 text-sm">{plant.description}</p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-energy-yellow" />
            <span className="text-gray-600">{plant.sunRequirement}</span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span className="text-gray-600">{plant.waterRequirement}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{plant.difficulty}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="text-gray-600">{plant.price}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {plant.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {plant.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{plant.tags.length - 3} more
            </Badge>
          )}
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setExpanded(!expanded)}
          className="w-full"
        >
          {expanded ? 'Show Less' : 'Show Details'}
          <Info className="w-4 h-4 ml-2" />
        </Button>

        {expanded && (
          <div className="space-y-4 pt-4 border-t">
            <Tabs defaultValue="care" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="care">Care</TabsTrigger>
                <TabsTrigger value="benefits">Benefits</TabsTrigger>
                <TabsTrigger value="companions">Companions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="care" className="space-y-2">
                <h4 className="font-semibold text-gray-900">Care Instructions:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {plant.careInstructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {instruction}
                    </li>
                  ))}
                </ul>
                
                {plant.commonIssues.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900">Common Issues:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {plant.commonIssues.map((issue, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="benefits" className="space-y-2">
                <h4 className="font-semibold text-gray-900">Benefits:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {plant.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-energy-yellow mt-0.5 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </TabsContent>
              
              <TabsContent value="companions" className="space-y-2">
                <h4 className="font-semibold text-gray-900">Companion Plants:</h4>
                <div className="flex flex-wrap gap-1">
                  {plant.companionPlants.map((companion, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {companion}
                    </Badge>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  )
}