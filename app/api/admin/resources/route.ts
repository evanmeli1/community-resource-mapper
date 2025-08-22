import { NextResponse } from "next/server";
import { checkAdminAuth } from "../../../lib/adminAuth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const { isAdmin } = await checkAdminAuth();
  
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const resources = await prisma.resource.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50
  });
  
  return NextResponse.json({ resources });
}

export async function POST(request: NextRequest) {
  const { isAdmin } = await checkAdminAuth();
  
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const data = await request.json();
    
    const resource = await prisma.resource.create({
      data: {
        name: data.name,
        category: data.category,
        type: data.type,
        address: data.address,
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lng),
        phone: data.phone || null,
        website: data.website || null,
        schedule: data.schedule || {},
        offerings: data.offerings || [],
        requirements: data.requirements || []
      }
    });
    
    return NextResponse.json({ success: true, resource });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create resource" }, { status: 500 });
  }
}