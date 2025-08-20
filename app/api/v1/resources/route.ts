import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { checkRateLimit } from '../../middleware/rateLimit'
export const dynamic = "force-dynamic";

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  // Check rate limit
  const rateLimitResponse = await checkRateLimit(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const resources = await prisma.resource.findMany({
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
        lastVerified: true,
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      data: resources,
      count: resources.length,
      version: "1.0",              // ← Add version info
      deprecated: false            // ← Add deprecation status
    }, {
      headers: {
        'API-Version': '1.0',       // ← Add version header
        'X-Deprecated': 'false'     // ← Add deprecation header
      }
    })
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch resources',
        version: "1.0"
      },
      { status: 500 }
    )
  }
}