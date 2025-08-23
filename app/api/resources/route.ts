// app/api/resources/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '../middleware/rateLimit'
import { prisma } from '../../lib/prisma'

export const dynamic = "force-dynamic";

function logApiCall(request: NextRequest, status: number, responseTime: number) {
  const ip = request.ip ?? request.headers.get("x-forwarded-for") ?? "unknown";
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  const timestamp = new Date().toISOString();
  
  console.log(`[AUDIT] ${timestamp} | ${request.method} ${request.url} | IP: ${ip} | Status: ${status} | Time: ${responseTime}ms | User-Agent: ${userAgent}`);
}

// Input validation helpers
function validateCoordinates(north: string, south: string, east: string, west: string) {
  const northNum = parseFloat(north);
  const southNum = parseFloat(south);
  const eastNum = parseFloat(east);
  const westNum = parseFloat(west);
  
  if (isNaN(northNum) || isNaN(southNum) || isNaN(eastNum) || isNaN(westNum)) {
    return { valid: false, error: 'Invalid coordinate format' };
  }
  
  if (northNum < -90 || northNum > 90 || southNum < -90 || southNum > 90) {
    return { valid: false, error: 'Latitude must be between -90 and 90' };
  }
  
  if (eastNum < -180 || eastNum > 180 || westNum < -180 || westNum > 180) {
    return { valid: false, error: 'Longitude must be between -180 and 180' };
  }
  
  if (northNum <= southNum || eastNum <= westNum) {
    return { valid: false, error: 'Invalid coordinate bounds' };
  }
  
  return { valid: true, coords: { northNum, southNum, eastNum, westNum } };
}

function sanitizeSearchTerm(search: string) {
  return search
    .trim()
    .slice(0, 100)
    .replace(/[<>]/g, '')
    .replace(/['"]/g, '')
    .replace(/\s+/g, ' ');
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  const rateLimitResponse = await checkRateLimit(request);
  if (rateLimitResponse) {
    logApiCall(request, 429, Date.now() - startTime);
    return rateLimitResponse;
  }

  try {
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const north = searchParams.get('north');
    const south = searchParams.get('south');
    const east = searchParams.get('east');
    const west = searchParams.get('west');
    
    const where: any = {};
    
    if (north && south && east && west) {
      const coordValidation = validateCoordinates(north, south, east, west);
      
      if (!coordValidation.valid) {
        logApiCall(request, 400, Date.now() - startTime);
        return NextResponse.json(
          { success: false, error: coordValidation.error },
          { status: 400 }
        );
      }
      
      where.lat = {
        gte: coordValidation.coords!.southNum,
        lte: coordValidation.coords!.northNum
      };
      where.lng = {
        gte: coordValidation.coords!.westNum,
        lte: coordValidation.coords!.eastNum
      };
    }
    
    if (category && category !== 'all') {
      const validCategories = ['food', 'shelter', 'health', 'education'];
      if (!validCategories.includes(category)) {
        logApiCall(request, 400, Date.now() - startTime);
        return NextResponse.json(
          { success: false, error: 'Invalid category' },
          { status: 400 }
        );
      }
      where.category = category;
    }
    
    if (search && search.trim()) {
      const trimmedSearch = search.trim();
      
      if (trimmedSearch.length > 100) {
        logApiCall(request, 400, Date.now() - startTime);
        return NextResponse.json(
          { success: false, error: 'Search term too long (max 100 characters)' },
          { status: 400 }
        );
      }
      
      if (trimmedSearch.length === 0) {
        logApiCall(request, 400, Date.now() - startTime);
        return NextResponse.json(
          { success: false, error: 'Search term cannot be empty' },
          { status: 400 }
        );
      }
      
      const sanitizedSearch = sanitizeSearchTerm(trimmedSearch);
      
      where.OR = [
        { name: { contains: sanitizedSearch, mode: 'insensitive' } },
        { address: { contains: sanitizedSearch, mode: 'insensitive' } },
        { type: { contains: sanitizedSearch.replace(' ', '_'), mode: 'insensitive' } }
      ];
    }

    const resources = await prisma.resource.findMany({
      where,
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
      },
      take: 200
    });

    const responseTime = Date.now() - startTime;
    logApiCall(request, 200, responseTime);

    return NextResponse.json({
      success: true,
      data: resources,
      count: resources.length,
      filtered: !!(category || search || north),
      version: "latest (1.0)",
      deprecated: false
    }, {
      headers: {
        'API-Version': 'latest (1.0)',
        'X-Deprecated': 'false',
        'X-Available-Versions': '1.0'
      }
    });
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