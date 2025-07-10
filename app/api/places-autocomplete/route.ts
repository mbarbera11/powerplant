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
      // Return mock data for development
      const mockPredictions = [
        {
          place_id: 'mock_austin',
          description: `${input}, Austin, TX, USA`,
          structured_formatting: {
            main_text: `${input}, Austin`,
            secondary_text: 'TX, USA'
          }
        },
        {
          place_id: 'mock_houston',
          description: `${input}, Houston, TX, USA`, 
          structured_formatting: {
            main_text: `${input}, Houston`,
            secondary_text: 'TX, USA'
          }
        },
        {
          place_id: 'mock_dallas',
          description: `${input}, Dallas, TX, USA`,
          structured_formatting: {
            main_text: `${input}, Dallas`, 
            secondary_text: 'TX, USA'
          }
        },
        {
          place_id: 'mock_san_antonio',
          description: `${input}, San Antonio, TX, USA`,
          structured_formatting: {
            main_text: `${input}, San Antonio`,
            secondary_text: 'TX, USA'
          }
        },
        {
          place_id: 'mock_fort_worth',
          description: `${input}, Fort Worth, TX, USA`,
          structured_formatting: {
            main_text: `${input}, Fort Worth`,
            secondary_text: 'TX, USA'
          }
        }
      ]
      
      return NextResponse.json({
        status: 'OK',
        predictions: mockPredictions
      })
    }

    // Make request to Google Places API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&types=address&components=country:us&key=${apiKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

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