import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { checkRateLimit } from '../middleware/rateLimit'

const prisma = new PrismaClient()

// Simple logging function
function logApiCall(request: NextRequest, status: number, responseTime: number) {
  const ip = request.ip ?? request.headers.get("x-forwarded-for") ?? "unknown";
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  const timestamp = new Date().toISOString();
  
  // Log to console (in production, this would go to a logging service)
  console.log(`[AUDIT] ${timestamp} | ${request.method} ${request.url} | IP: ${ip} | Status: ${status} | Time: ${responseTime}ms | User-Agent: ${userAgent}`);
}

export async function GET(request: NextRequest) {
  const startTime = Date.now(); // Track how long the request takes
  
  // Check rate limit
  const rateLimitResponse = await checkRateLimit(request);
  if (rateLimitResponse) {
    // Log the rate-limited request
    logApiCall(request, 429, Date.now() - startTime);
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

    const responseTime = Date.now() - startTime;
    
    // Log successful request
    logApiCall(request, 200, responseTime);

    return NextResponse.json({
      success: true,
      data: resources,
      count: resources.length,
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
    
    // Log failed request
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