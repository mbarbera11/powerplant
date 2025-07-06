interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  timestamp?: number
}

interface UserFlow {
  sessionId: string
  events: AnalyticsEvent[]
  startTime: number
  lastActivity: number
}

class Analytics {
  private sessionId: string
  private userFlow: UserFlow
  private isEnabled = true

  constructor() {
    this.sessionId = this.generateSessionId()
    this.userFlow = {
      sessionId: this.sessionId,
      events: [],
      startTime: Date.now(),
      lastActivity: Date.now(),
    }

    // Check if analytics is enabled (respect privacy settings)
    this.isEnabled = this.checkAnalyticsConsent()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private checkAnalyticsConsent(): boolean {
    if (typeof window === "undefined") return false

    const consent = localStorage.getItem("analytics_consent")
    return consent === "true"
  }

  track(event: string, properties?: Record<string, any>): void {
    if (!this.isEnabled) return

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        url: typeof window !== "undefined" ? window.location.href : "",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        timestamp: Date.now(),
      },
      timestamp: Date.now(),
    }

    this.userFlow.events.push(analyticsEvent)
    this.userFlow.lastActivity = Date.now()

    // Send to analytics service (replace with your preferred service)
    this.sendToAnalytics(analyticsEvent)
  }

  private async sendToAnalytics(event: AnalyticsEvent): Promise<void> {
    try {
      // In production, replace with your analytics service
      await fetch("/api/analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      })
    } catch (error) {
      console.error("Analytics error:", error)
    }
  }

  // Track specific PowerPlant events
  trackRecommendationView(plantId: string, matchScore: number): void {
    this.track("recommendation_viewed", {
      plant_id: plantId,
      match_score: matchScore,
    })
  }

  trackNurseryClick(nurseryId: string, action: "view" | "call" | "directions"): void {
    this.track("nursery_interaction", {
      nursery_id: nurseryId,
      action,
    })
  }

  trackOnboardingStep(step: number, completed: boolean): void {
    this.track("onboarding_step", {
      step,
      completed,
    })
  }

  trackPlantSearch(query: string, resultsCount: number): void {
    this.track("plant_search", {
      query,
      results_count: resultsCount,
    })
  }

  trackShoppingListAction(action: "add" | "remove" | "email", plantCount: number): void {
    this.track("shopping_list_action", {
      action,
      plant_count: plantCount,
    })
  }

  // Get user flow for analysis
  getUserFlow(): UserFlow {
    return { ...this.userFlow }
  }

  // Enable/disable analytics
  setConsent(enabled: boolean): void {
    this.isEnabled = enabled
    if (typeof window !== "undefined") {
      localStorage.setItem("analytics_consent", enabled.toString())
    }
  }
}

export const analytics = new Analytics()

// React hook for analytics
export function useAnalytics() {
  return {
    track: analytics.track.bind(analytics),
    trackRecommendationView: analytics.trackRecommendationView.bind(analytics),
    trackNurseryClick: analytics.trackNurseryClick.bind(analytics),
    trackOnboardingStep: analytics.trackOnboardingStep.bind(analytics),
    trackPlantSearch: analytics.trackPlantSearch.bind(analytics),
    trackShoppingListAction: analytics.trackShoppingListAction.bind(analytics),
    setConsent: analytics.setConsent.bind(analytics),
  }
}
