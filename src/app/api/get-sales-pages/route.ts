import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const salesPages = await prisma.salesPage.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ salesPages })
  } catch (error) {
    console.error('Error fetching sales pages:', error)
    return NextResponse.json(
      { message: 'セールスページの取得中にエラーが発生しました' },
      { status: 500 }
    )
  }
} 