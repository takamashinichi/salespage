import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const salesPage = await prisma.salesPage.findUnique({
      where: {
        id: parseInt((await params).id)
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