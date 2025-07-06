"use client"

import { CheckCircle, Award, Zap, Shield } from "lucide-react"
import { Badge } from "./badge"

interface TrustBadgeProps {
  type: "guarantee" | "verified" | "partner" | "expert"
  text?: string
  size?: "sm" | "md" | "lg"
}

export function TrustBadge({ type, text, size = "md" }: TrustBadgeProps) {
  const configs = {
    guarantee: {
      icon: CheckCircle,
      text: text || "PowerPlant Guarantee",
      className: "bg-powerplant-green text-white",
    },
    verified: {
      icon: Shield,
      text: text || "Climate Verified",
      className: "bg-lightning-blue text-white",
    },
    partner: {
      icon: Award,
      text: text || "PowerPlant Partner",
      className: "bg-energy-yellow text-powerplant-green",
    },
    expert: {
      icon: Zap,
      text: text || "Expert Recommended",
      className: "bg-gradient-to-r from-powerplant-green to-energy-yellow text-white",
    },
  }

  const config = configs[type]
  const Icon = config.icon
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2",
  }

  return (
    <Badge className={`${config.className} ${sizeClasses[size]} flex items-center gap-1 font-medium`}>
      <Icon className={`${size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4"}`} />
      {config.text}
    </Badge>
  )
}
