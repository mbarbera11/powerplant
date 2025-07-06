"use client"

import { CheckCircle, Zap, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

export function SuccessAnimation({ message = "Your garden power is growing!" }: { message?: string }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(true)
  }, [])

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 transition-all duration-500 ${show ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
    >
      <div className="relative mb-4">
        <div className="w-20 h-20 bg-gradient-to-br from-powerplant-green to-energy-yellow rounded-full flex items-center justify-center animate-bounce">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <Zap className="w-6 h-6 text-energy-yellow absolute -top-2 -right-2 animate-pulse" />
        <Sparkles className="w-4 h-4 text-lightning-blue absolute -bottom-1 -left-1 animate-ping" />
      </div>
      <p className="text-xl font-bold text-powerplant-green font-montserrat mb-2">{message}</p>
      <p className="text-sm text-gray-600">You've got this! 🌱</p>
    </div>
  )
}
