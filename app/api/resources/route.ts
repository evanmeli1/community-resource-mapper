import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { checkRateLimit } from '../middleware/rateLimit'

export const dynamic = "force-dynamic";

const prisma = new PrismaClient()

function logApiCall(request: NextRequest, status: number, responseTime: number) {
  const ip = request.ip ?? request.headers.get("x-forwarded-for") ?? "unknown";
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  const timestamp = new Date().toISOString();
  
  console.log(`[AUDIT] ${timestamp} | ${request.method} ${request.url} | IP: ${ip} | Status: ${status} | Time: ${responseTime}ms | User-Agent: ${userAgent}`);
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  // Check rate limit
  const rateLimitResponse = await checkRateLimit(request);
  if (rateLimitResponse) {
    logApiCall(request, 429, Date.now() - startTime);
    return rateLimitResponse;
  }

  try {
    // Get optional geographic bounds from query params
    const { searchParams } = new URL(request.url);
    const north = searchParams.get('north');
    const south = searchParams.get('south');
    const east = searchParams.get('east');
    const west = searchParams.get('west');

    // Build where clause - only add geographic filter if ALL bounds are provided
    const where: any = {};
    if (north && south && east && west) {
      where.lat = { 
        gte: parseFloat(south), 
        lte: parseFloat(north) 
      };
      where.lng = { 
        gte: parseFloat(west), 
        lte: parseFloat(east) 
      };
    }

    const resources = await prisma.resource.findMany({
      where, // This will be empty object if no bounds provided
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
        schedule: true,
      },
      orderBy: {
        name: 'asc'
      }
    })

    const responseTime = Date.now() - startTime;
    logApiCall(request, 200, responseTime);

    return NextResponse.json({
      success: true,
      data: resources,
      count: resources.length,
      filtered: !!(north && south && east && west), // Indicate if geographic filtering was applied
      version: "latest (1.0)",
      deprecated: false
    }, {
      headers: {
        'API-Version': 'latest (1.0)',
        'X-Deprecated': 'false',
        'X-Available-Versions': '1.0'
      }
    })
  } catch (error) {
    const responseTime = Date.now() - startTime;
    logApiCall(request, 500, responseTime);
    
    console.error('Error fetching resources:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch resources',
        version: "latest"
      },
      { status: 500 }
    )
  }
}