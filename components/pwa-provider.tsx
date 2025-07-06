"use client"

import type React from "react"

import { useEffect } from "react"
import { usePWA, registerServiceWorker } from "@/lib/pwa"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"
import { useState } from "react"

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const { isInstallable, isInstalled, installApp } = usePWA()
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    registerServiceWorker()
  }, [])

  useEffect(() => {
    if (isInstallable && !isInstalled) {
      // Show install prompt after a delay
      const timer = setTimeout(() => {
        setShowInstallPrompt(true)
      }, 10000) // Show after 10 seconds

      return () => clearTimeout(timer)
    }
  }, [isInstallable, isInstalled])

  const handleInstall = async () => {
    const success = await installApp()
    if (success) {
      setShowInstallPrompt(false)
    }
  }

  return (
    <>
      {children}

      {/* Install Prompt */}
      {showInstallPrompt && (
        <div className="fixed bottom-4 left-4 right-4 z-50 bg-white border border-powerplant-green/20 rounded-lg shadow-lg p-4 max-w-sm mx-auto">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-powerplant-green to-energy-yellow rounded-lg flex items-center justify-center flex-shrink-0">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-powerplant-green mb-1">Install PowerPlant</h3>
              <p className="text-sm text-gray-600 mb-3">
                Get faster access and offline features by installing our app!
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleInstall}
                  className="bg-powerplant-green text-white hover:bg-powerplant-green/90"
                >
                  Install
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowInstallPrompt(false)}
                  className="bg-transparent"
                >
                  Later
                </Button>
              </div>
            </div>
            <button onClick={() => setShowInstallPrompt(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
