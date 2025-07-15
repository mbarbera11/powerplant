import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { input } = await request.json()
    
    if (!input || input.length < 3) {
      return NextResponse.json({ 
        status: 'INVALID_REQUEST',
        predictions: [] 
      })
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    
    if (!apiKey || apiKey === 'demo_key') {
      // Return realistic mock data for development
      const isNumeric = /^\d/.test(input)
      const isAddress = input.includes(' ') || isNumeric
      
      let mockPredictions = []
      
      if (isAddress && isNumeric) {
        // Address-like input - suggest specific addresses
        mockPredictions = [
          {
            place_id: 'mock_addr_1',
            description: `${input} Main St, Austin, TX, USA`,
            structured_formatting: {
              main_text: `${input} Main St`,
              secondary_text: 'Austin, TX, USA'
            }
          },
          {
            place_id: 'mock_addr_2',
            description: `${input} Oak Ave, Houston, TX, USA`,
            structured_formatting: {
              main_text: `${input} Oak Ave`,
              secondary_text: 'Houston, TX, USA'
            }
          },
          {
            place_id: 'mock_addr_3',
            description: `${input} Elm St, Dallas, TX, USA`,
            structured_formatting: {
              main_text: `${input} Elm St`,
              secondary_text: 'Dallas, TX, USA'
            }
          }
        ]
      } else {
        // City/area input - suggest cities and neighborhoods
        mockPredictions = [
          {
            place_id: 'mock_city_1',
            description: `${input}, Austin, TX, USA`,
            structured_formatting: {
              main_text: input,
              secondary_text: 'Austin, TX, USA'
            }
          },
          {
            place_id: 'mock_city_2',
            description: `${input}, Houston, TX, USA`,
            structured_formatting: {
              main_text: input,
              secondary_text: 'Houston, TX, USA'
            }
          },
          {
            place_id: 'mock_city_3',
            description: `${input}, Dallas, TX, USA`,
            structured_formatting: {
              main_text: input,
              secondary_text: 'Dallas, TX, USA'
            }
          },
          {
            place_id: 'mock_city_4',
            description: `${input}, San Antonio, TX, USA`,
            structured_formatting: {
              main_text: input,
              secondary_text: 'San Antonio, TX, USA'
            }
          }
        ]
      }
      
      return NextResponse.json({
        status: 'OK',
        predictions: mockPredictions
      })
    }

    // Make request to Google Places API with better parameters
    const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json')
    url.searchParams.set('input', input)
    url.searchParams.set('types', 'address')
    url.searchParams.set('components', 'country:us')
    url.searchParams.set('language', 'en')
    url.searchParams.set('key', apiKey)
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Google API request failed: ${response.status}`)
    }

    const data = await response.json()
    
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Places Autocomplete API error:', error)
    
    return NextResponse.json(
      { 
        status: 'ERROR',
        error_message: 'Internal server error',
        predictions: []
      },
      { status: 500 }
    )
  }
}