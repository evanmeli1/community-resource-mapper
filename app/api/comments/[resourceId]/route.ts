import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '../../middleware/rateLimit'
import { prisma } from '../../../lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { resourceId: string } }
) {
  // Rate limiting
  const rateLimitResponse = await checkRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const resourceId = params.resourceId;

    // Validate resourceId format
    if (!resourceId || typeof resourceId !== 'string' || resourceId.length < 10) {
      return NextResponse.json(
        { error: 'Invalid resource ID' },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: {
        resourceId,
      },
      include: {
        user: {
          select: {
            name: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limit comments to prevent performance issues
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