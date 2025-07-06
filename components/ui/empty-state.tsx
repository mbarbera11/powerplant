"use client"

import { Leaf, Zap } from "lucide-react"
import { Button } from "./button"

interface EmptyStateProps {
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  title = "Ready to discover your power plants?",
  description = "Let's unlock your garden's potential together",
  actionLabel = "Power Up My Garden",
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-powerplant-green/10 via-energy-yellow/10 to-lightning-blue/10 rounded-full flex items-center justify-center mb-6 relative">
        <Leaf className="w-12 h-12 text-powerplant-green/50" />
        <Zap className="w-6 h-6 text-energy-yellow/50 absolute top-2 right-2" />
      </div>
      <h3 className="text-xl font-bold text-powerplant-green font-montserrat mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{description}</p>
      {onAction && (
        <Button
          onClick={onAction}
          className="bg-gradient-to-r from-powerplant-green to-energy-yellow hover:from-powerplant-green/90 hover:to-energy-yellow/90 text-white transform hover:scale-105 transition-all duration-200"
        >
          <Zap className="w-4 h-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
