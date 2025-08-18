import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Simple distance calculation function
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c // Distance in kilometers
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = parseFloat(searchParams.get('lat') || '37.7749')
    const lng = parseFloat(searchParams.get('lng') || '-122.4194') 
    const radius = parseFloat(searchParams.get('radius') || '10')

    // Get all resources first
    const allResources = await prisma.resource.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        type: true,
        address: true,
        lat: true,
        lng: true,
        phone: true,
        website: true,
      }
    })

    // Calculate distances and filter
    const nearbyResources = allResources
      .map(resource => ({
        ...resource,
        distance: calculateDistance(lat, lng, resource.lat, resource.lng)
      }))
      .filter(resource => resource.distance <= radius)
      .sort((a, b) => a.distance - b.distance)

    return NextResponse.json({
      success: true,
      data: nearbyResources,
      query: { lat, lng, radius },
      count: nearbyResources.length
    })
  } catch (error) {
    console.error('Error fetching nearby resources:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch nearby resources' },
      { status: 500 }
    )
  }
}