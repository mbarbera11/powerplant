"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useAnalytics } from "@/lib/analytics"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, X } from "lucide-react"

interface AnalyticsContextType {
  track: (event: string, properties?: Record<string, any>) => void
  trackRecommendationView: (plantId: string, matchScore: number) => void
  trackNurseryClick: (nurseryId: string, action: "view" | "call" | "directions") => void
  trackOnboardingStep: (step: number, completed: boolean) => void
  trackPlantSearch: (query: string, resultsCount: number) => void
  trackShoppingListAction: (action: "add" | "remove" | "email", plantCount: number) => void
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null)

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const analytics = useAnalytics()
  const [showConsentBanner, setShowConsentBanner] = useState(false)

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem("analytics_consent")
    if (consent === null) {
      setShowConsentBanner(true)
    } else {
      analytics.setConsent(consent === "true")
    }
  }, [analytics])

  const handleAcceptAnalytics = () => {
    analytics.setConsent(true)
    setShowConsentBanner(false)
  }

  const handleDeclineAnalytics = () => {
    analytics.setConsent(false)
    setShowConsentBanner(false)
  }

  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}

      {/* Privacy Consent Banner */}
      {showConsentBanner && (
        <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
          <Card className="border-powerplant-green/20 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-powerplant-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-powerplant-green" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-powerplant-green mb-1">Privacy & Analytics</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    We use analytics to improve your PowerPlant experience. Your data is never shared with third
                    parties.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleAcceptAnalytics}
                      className="bg-powerplant-green text-white hover:bg-powerplant-green/90"
                    >
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleDeclineAnalytics} className="bg-transparent">
                      Decline
                    </Button>
                  </div>
                </div>
                <button onClick={handleDeclineAnalytics} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AnalyticsContext.Provider>
  )
}

export function useAnalyticsContext() {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error("useAnalyticsContext must be used within AnalyticsProvider")
  }
  return context
}
