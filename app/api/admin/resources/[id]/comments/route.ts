import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "../../../../../lib/adminAuth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { isAdmin } = await checkAdminAuth();
  
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Validate resource ID
  if (!params.id || typeof params.id !== 'string') {
    return NextResponse.json({ error: "Invalid resource ID" }, { status: 400 });
  }
  
  try {
    const resource = await prisma.resource.findUnique({
      where: { id: params.id },
      include: {
        comments: {
          include: { user: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }
    
    return NextResponse.json({ resource });
  } catch (error) {
    console.error('Fetch resource comments error:', error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}