"use client"

import { AlertCircle, Zap, RefreshCw } from "lucide-react"
import { Button } from "./button"

interface ErrorStateProps {
  title?: string
  description?: string
  actionLabel?: string
  onRetry?: () => void
}

export function ErrorState({
  title = "Let's get you back on track to garden success!",
  description = "Don't worry - every great gardener faces challenges. We're here to help you grow your power.",
  actionLabel = "Try Again",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-energy-yellow/20 rounded-full flex items-center justify-center mb-6 relative">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <Zap className="w-6 h-6 text-energy-yellow absolute top-2 right-2 opacity-50" />
      </div>
      <h3 className="text-xl font-bold text-powerplant-green font-montserrat mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{description}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          className="bg-gradient-to-r from-powerplant-green to-energy-yellow hover:from-powerplant-green/90 hover:to-energy-yellow/90 text-white transform hover:scale-105 transition-all duration-200"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
