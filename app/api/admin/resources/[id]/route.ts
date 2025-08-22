import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "../../../../lib/adminAuth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Delete resource
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { isAdmin } = await checkAdminAuth();
  
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    await prisma.resource.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete resource" }, { status: 500 });
  }
}

// Update resource
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { isAdmin } = await checkAdminAuth();
  
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const data = await request.json();
    
    const resource = await prisma.resource.update({
      where: { id: params.id },
      data: {
        name: data.name,
        category: data.category,
        type: data.type,
        address: data.address,
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lng),
        phone: data.phone || null,
        website: data.website || null,
        schedule: data.schedule,
        offerings: data.offerings,
        requirements: data.requirements
      }
    });
    
    return NextResponse.json({ success: true, resource });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update resource" }, { status: 500 });
  }
}