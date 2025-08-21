import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { resourceId: string } }
) {
  try {
    const resourceId = params.resourceId

    const comments = await prisma.comment.findMany({
      where: {
        resourceId,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      comments,
    })

  } catch (error) {
    console.error('Comments fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}