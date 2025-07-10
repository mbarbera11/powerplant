"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { MapPin, X } from "lucide-react"

interface AddressAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onSelect?: (placeId: string, address: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

interface PlacePrediction {
  place_id: string
  description: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
}

export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Enter your address or city...",
  className = "",
  disabled = false
}: AddressAutocompleteProps) {
  const [predictions, setPredictions] = useState<PlacePrediction[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch predictions from Google Places API
  const fetchPredictions = async (input: string) => {
    if (!input.trim() || input.length < 3) {
      setPredictions([])
      setIsOpen(false)
      return
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey || apiKey === 'demo_key') {
      // Mock predictions for development
      const mockPredictions: PlacePrediction[] = [
        {
          place_id: 'mock_1',
          description: `${input}, TX, USA`,
          structured_formatting: {
            main_text: input,
            secondary_text: 'TX, USA'
          }
        },
        {
          place_id: 'mock_2', 
          description: `${input}, CA, USA`,
          structured_formatting: {
            main_text: input,
            secondary_text: 'CA, USA'
          }
        },
        {
          place_id: 'mock_3',
          description: `${input}, NY, USA`,
          structured_formatting: {
            main_text: input,
            secondary_text: 'NY, USA'
          }
        }
      ]
      setPredictions(mockPredictions)
      setIsOpen(true)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      
      // Use a server-side endpoint to avoid CORS issues
      const response = await fetch('/api/places-autocomplete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      })

      if (!response.ok) {
        throw new Error('Autocomplete request failed')
      }

      const data = await response.json()
      
      if (data.status === 'OK' && data.predictions) {
        setPredictions(data.predictions.slice(0, 5)) // Limit to 5 suggestions
        setIsOpen(true)
      } else {
        setPredictions([])
        setIsOpen(false)
      }
    } catch (error) {
      console.error('Autocomplete error:', error)
      // Fallback to enhanced mock data
      const mockPredictions: PlacePrediction[] = [
        {
          place_id: 'mock_1',
          description: `${input}, Austin, TX, USA`,
          structured_formatting: {
            main_text: `${input}, Austin`,
            secondary_text: 'TX, USA'
          }
        },
        {
          place_id: 'mock_2', 
          description: `${input}, Houston, TX, USA`,
          structured_formatting: {
            main_text: `${input}, Houston`,
            secondary_text: 'TX, USA'
          }
        },
        {
          place_id: 'mock_3',
          description: `${input}, Dallas, TX, USA`,
          structured_formatting: {
            main_text: `${input}, Dallas`,
            secondary_text: 'TX, USA'
          }
        }
      ]
      setPredictions(mockPredictions)
      setIsOpen(true)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle input change with debouncing
  const handleInputChange = (newValue: string) => {
    onChange(newValue)
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout for API call
    timeoutRef.current = setTimeout(() => {
      fetchPredictions(newValue)
    }, 300) // 300ms debounce
  }

  // Handle prediction selection
  const handleSelect = (prediction: PlacePrediction) => {
    onChange(prediction.description)
    setIsOpen(false)
    setPredictions([])
    
    if (onSelect) {
      onSelect(prediction.place_id, prediction.description)
    }
  }

  // Handle clear
  const handleClear = () => {
    onChange('')
    setPredictions([])
    setIsOpen(false)
    inputRef.current?.focus()
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => value.length >= 3 && predictions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={`pl-10 pr-10 ${className}`}
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-powerplant-green"></div>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && predictions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {predictions.map((prediction) => (
            <button
              key={prediction.place_id}
              type="button"
              onClick={() => handleSelect(prediction)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-gray-900 truncate">
                    {prediction.structured_formatting.main_text}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {prediction.structured_formatting.secondary_text}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}