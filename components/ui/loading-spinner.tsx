"use client"

import { Leaf, Zap } from "lucide-react"

export function LoadingSpinner({ message = "Growing your recommendations..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-powerplant-green via-energy-yellow to-lightning-blue rounded-full flex items-center justify-center animate-pulse">
          <Leaf className="w-8 h-8 text-white animate-bounce" />
          <Zap className="w-4 h-4 text-white absolute top-2 right-2 animate-ping" />
        </div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-energy-yellow/30 rounded-full animate-spin border-t-energy-yellow"></div>
      </div>
      <p className="text-powerplant-green font-medium font-montserrat">{message}</p>
      <p className="text-sm text-gray-600 mt-1">Your garden power is loading...</p>
    </div>
  )
}
