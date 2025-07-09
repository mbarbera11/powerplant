"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Leaf,
  MapPin,
  Lightbulb,
  ShoppingBag,
  Flower,
  Carrot,
  FlowerIcon as Herb,
  TreePine,
  Star,
  Instagram,
  Twitter,
  Facebook,
  Zap,
  CheckCircle,
  Users,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function PowerPlantLanding() {
  const [location, setLocation] = useState("")
  const router = useRouter()

  const handleGetStarted = () => {
    if (location.trim()) {
      // Store location in localStorage for the onboarding process
      localStorage.setItem('userLocation', location)
      router.push('/onboarding')
    } else {
      // If no location, still go to onboarding but they'll be prompted there
      router.push('/onboarding')
    }
  }

  const handleCategoryExplore = (categoryName: string) => {
    // Store the preferred category and navigate to onboarding
    localStorage.setItem('preferredCategory', categoryName.toLowerCase())
    router.push('/onboarding')
  }

  const plantCategories = [
    {
      name: "Flowers",
      icon: Flower,
      description: "Colorful blooms to brighten your space",
      samples: ["Sunflowers", "Roses", "Marigolds"],
      gradient: "from-pink-400 to-purple-500",
    },
    {
      name: "Vegetables",
      icon: Carrot,
      description: "Fresh produce for your table",
      samples: ["Tomatoes", "Peppers", "Lettuce"],
      gradient: "from-green-400 to-emerald-500",
    },
    {
      name: "Herbs",
      icon: Herb,
      description: "Aromatic plants for cooking & wellness",
      samples: ["Basil", "Mint", "Rosemary"],
      gradient: "from-emerald-400 to-teal-500",
    },
    {
      name: "Shrubs",
      icon: TreePine,
      description: "Structure and beauty for your landscape",
      samples: ["Lavender", "Boxwood", "Hydrangea"],
      gradient: "from-blue-400 to-indigo-500",
    },
  ]

  const howItWorksSteps = [
    {
      step: 1,
      title: "Tell Us Your Goals",
      description: "Share your location, space, and what you want to grow",
      icon: MapPin,
    },
    {
      step: 2,
      title: "Get Smart Recommendations",
      description: "Our AI matches you with perfect plants for your conditions",
      icon: Lightbulb,
    },
    {
      step: 3,
      title: "Shop Locally",
      description: "Connect with nearby nurseries and get growing",
      icon: ShoppingBag,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-powerplant-green/5 via-white to-energy-yellow/5">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-powerplant-green/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-powerplant-green via-energy-yellow to-lightning-blue rounded-lg flex items-center justify-center relative overflow-hidden">
              <Leaf className="w-5 h-5 text-white absolute" />
              <Zap className="w-3 h-3 text-white absolute top-1 right-1 opacity-70" />
            </div>
            <span className="text-xl font-bold text-powerplant-green font-montserrat">PowerPlant</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#how-it-works" className="text-gray-700 hover:text-powerplant-green transition-colors">
              How It Works
            </Link>
            <Link href="/nurseries" className="text-gray-700 hover:text-powerplant-green transition-colors">
              Find Nurseries
            </Link>
            <Button 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-powerplant-green to-powerplant-green/80 hover:from-powerplant-green/90 hover:to-powerplant-green/70 text-white font-semibold"
            >
              Grow Your Power
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-powerplant-green/10 via-transparent to-energy-yellow/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8 animate-fade-in">
              <h1 className="text-5xl md:text-7xl font-bold text-powerplant-green mb-6 font-montserrat">
                Unlock Your{" "}
                <span className="bg-gradient-to-r from-energy-yellow to-lightning-blue bg-clip-text text-transparent">
                  Garden Power
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-8 font-open-sans">
                Discover plants guaranteed to thrive in your space and climate
              </p>
            </div>

            {/* Location Input CTA */}
            <div className="max-w-md mx-auto mb-8">
              <div className="flex gap-2 p-2 bg-white rounded-full shadow-lg border-2 border-powerplant-green/20 hover:border-powerplant-green/40 transition-colors">
                <div className="flex items-center pl-4 text-gray-500">
                  <MapPin className="w-5 h-5" />
                </div>
                <Input
                  type="text"
                  placeholder="Enter your zip code or city"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGetStarted()}
                  className="border-0 bg-transparent focus-visible:ring-0 text-lg"
                />
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-powerplant-green to-energy-yellow hover:from-powerplant-green/90 hover:to-energy-yellow/90 text-white font-semibold rounded-full px-8 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Power Up My Garden
                </Button>
              </div>
            </div>

            {/* Value Proposition */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 font-open-sans">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-powerplant-green rounded-full"></div>
                <CheckCircle className="w-4 h-4 text-powerplant-green" />
                PowerPlant Guarantee
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-energy-yellow rounded-full"></div>
                <MapPin className="w-4 h-4 text-energy-yellow" />
                Climate Verified
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-lightning-blue rounded-full"></div>
                <Users className="w-4 h-4 text-lightning-blue" />
                Locally Recommended
              </div>
            </div>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-energy-yellow/20 to-transparent rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-lightning-blue/20 to-transparent rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-powerplant-green/20 to-transparent rounded-full animate-pulse delay-500"></div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-powerplant-green mb-4 font-montserrat">How It Works</h2>
            <p className="text-xl text-gray-600 font-open-sans">Three simple steps to plant success</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-powerplant-green to-energy-yellow rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-lightning-blue rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-powerplant-green mb-3 font-montserrat">{step.title}</h3>
                <p className="text-gray-600 font-open-sans">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plant Categories */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-powerplant-green mb-4 font-montserrat">
              Explore Plant Categories
            </h2>
            <p className="text-xl text-gray-600 font-open-sans">Find the perfect plants for your goals</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {plantCategories.map((category, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white"
              >
                <CardContent className="p-6">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${category.gradient} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-powerplant-green mb-2 font-montserrat">{category.name}</h3>
                  <p className="text-gray-600 mb-4 font-open-sans text-sm">{category.description}</p>
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {category.samples.map((sample, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          {sample}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleCategoryExplore(category.name)}
                    className="w-full border-powerplant-green text-powerplant-green hover:bg-powerplant-green hover:text-white transition-colors bg-transparent"
                  >
                    Explore {category.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-powerplant-green text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 font-montserrat">
              Join Thousands Growing Their Garden Power
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div>
                <div className="text-4xl font-bold text-energy-yellow mb-2">50K+</div>
                <div className="text-powerplant-green-light">Plants Powered Up</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-energy-yellow mb-2">98%</div>
                <div className="text-powerplant-green-light">Success Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-energy-yellow mb-2">1,200+</div>
                <div className="text-powerplant-green-light">Partner Nurseries</div>
              </div>
            </div>
            <div className="flex justify-center items-center gap-2 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-energy-yellow text-energy-yellow" />
              ))}
              <span className="ml-2 text-lg">4.9/5 from 10,000+ reviews</span>
            </div>
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="bg-white text-powerplant-green hover:bg-gray-100 font-semibold px-8"
            >
              <Zap className="w-4 h-4 mr-2" />
              Grow Your Power Today
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-powerplant-green to-energy-yellow rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-montserrat">PowerPlant</span>
            </div>

            <div className="text-center mb-6 md:mb-0">
              <p className="text-gray-400 font-open-sans">Join the PowerPlant community</p>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-6 h-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-6 h-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-6 h-6" />
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 PowerPlant. All rights reserved. Grow your power, naturally! 🌱</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
