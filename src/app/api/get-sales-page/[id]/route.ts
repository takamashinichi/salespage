import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const salesPage = await prisma.salesPage.findUnique({
      where: {
        id: parseInt(params.id)
      }
    })

    if (!salesPage) {
      return NextResponse.json(
        { message: 'セールスページが見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json({ salesPage })
  } catch (error) {
    console.error('Error fetching sales page:', error)
    return NextResponse.json(
      { message: 'セールスページの取得中にエラーが発生しました' },
      { status: 500 }
    )
  }
} 