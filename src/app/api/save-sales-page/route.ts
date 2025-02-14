import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    const savedPage = await prisma.salesPage.create({
      data: {
        productName: data.productName,
        targetPersona: data.targetPersona,
        targetAge: data.targetAge,
        targetGender: data.targetGender,
        targetOccupation: data.targetOccupation,
        fear: data.fear,
        agitate: data.agitate,
        solution: data.solution,
        features: data.features,
        benefits: data.benefits,
        mediaExposure: data.mediaExposure,
        testimonials: data.testimonials,
        originalPrice: data.originalPrice,
        specialPrice: data.specialPrice,
        bonus: data.bonus,
        bonusDeadline: data.bonusDeadline,
        scarcity: data.scarcity,
        urgency: data.urgency,
        salesLetter: data.salesLetter,
      },
    });

    return NextResponse.json({ 
      message: "セールスページが保存されました",
      data: savedPage 
    });

  } catch (error) {
    console.error("Error saving sales page:", error);
    return NextResponse.json(
      { message: "セールスページの保存中にエラーが発生しました" },
      { status: 500 }
    );
  }
} 