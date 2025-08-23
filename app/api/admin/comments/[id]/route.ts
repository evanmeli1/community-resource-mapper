import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "../../../../lib/adminAuth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { isAdmin } = await checkAdminAuth();
  
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Validate comment ID
  if (!params.id || typeof params.id !== 'string') {
    return NextResponse.json({ error: "Invalid comment ID" }, { status: 400 });
  }
  
  try {
    await prisma.comment.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete comment error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}