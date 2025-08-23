import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "../../../lib/adminAuth";
import { prisma } from "../../../lib/prisma";

// Validation helper
function validateResourceData(data: any) {
  const errors = [];
  
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0 || data.name.length > 100) {
    errors.push('Name is required and must be under 100 characters');
  }
  
  if (!data.category || !['food', 'shelter', 'health', 'education'].includes(data.category)) {
    errors.push('Valid category required (food, shelter, health, education)');
  }
  
  if (!data.type || typeof data.type !== 'string' || data.type.length > 50) {
    errors.push('Type is required and must be under 50 characters');
  }
  
  if (!data.address || typeof data.address !== 'string' || data.address.length > 200) {
    errors.push('Address is required and must be under 200 characters');
  }
  
  const lat = parseFloat(data.lat);
  const lng = parseFloat(data.lng);
  if (isNaN(lat) || lat < -90 || lat > 90) {
    errors.push('Valid latitude required (-90 to 90)');
  }
  if (isNaN(lng) || lng < -180 || lng > 180) {
    errors.push('Valid longitude required (-180 to 180)');
  }
  
  if (data.phone && (typeof data.phone !== 'string' || data.phone.length > 20)) {
    errors.push('Phone must be under 20 characters');
  }
  
  if (data.website && (typeof data.website !== 'string' || !data.website.match(/^https?:\/\/.+/))) {
    errors.push('Website must be a valid URL');
  }
  
  return { 
    isValid: errors.length === 0, 
    errors, 
    cleanData: {
      name: data.name?.trim(),
      category: data.category,
      type: data.type?.trim(),
      address: data.address?.trim(),
      lat,
      lng,
      phone: data.phone?.trim() || null,
      website: data.website?.trim() || null,
      schedule: typeof data.schedule === 'object' ? data.schedule : {},
      offerings: Array.isArray(data.offerings) ? data.offerings : [],
      requirements: Array.isArray(data.requirements) ? data.requirements : []
    }
  };
}

export async function GET() {
  const { isAdmin } = await checkAdminAuth();
  
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const resources = await prisma.resource.findMany({
      include: {
        _count: {
          select: { comments: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    
    return NextResponse.json({ resources });
  } catch (error) {
    console.error('GET resources error:', error);
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { isAdmin } = await checkAdminAuth();
  
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const rawData = await request.json();
    
    // Validate input data
    const { isValid, errors, cleanData } = validateResourceData(rawData);
    
    if (!isValid) {
      return NextResponse.json({ 
        error: "Validation failed", 
        details: errors 
      }, { status: 400 });
    }
    
    const resource = await prisma.resource.create({
      data: cleanData
    });
    
    return NextResponse.json({ success: true, resource });
  } catch (error) {
    console.error('POST resource error:', error);
    return NextResponse.json({ error: "Failed to create resource" }, { status: 500 });
  }
}