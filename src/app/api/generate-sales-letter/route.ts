import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from '@anthropic-ai/sdk';
import { TextBlock } from '@anthropic-ai/sdk/resources/index.mjs';

// Prismaの一時的な無効化
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { models, ...data } = await req.json();
    const prompt = `以下の情報を元に、ストーリー性のある魅力的なセールスレターを作成してください。
文章は自然な流れで展開し、見出しや項目名は使用せず、読者に直接語りかけるような文体で書いてください。

製品情報：
${data.productName}は、${data.targetPersona}（${data.targetAge}、${data.targetGender}、${data.targetOccupation}）に向けた製品です。

現在の課題：
${data.fear}
${data.agitate}

解決策として：
${data.solution}
${data.features}
${data.benefits}

社会的評価：
${data.mediaExposure}
${data.testimonials}

価格設定：
通常価格${data.originalPrice}円のところ、特別価格${data.specialPrice}円
${data.bonus}（${data.bonusDeadline}まで）
${data.scarcity}
${data.urgency}

文章作成の重要なポイント：
・読者に直接語りかける親近感のある文体を使用
・一つの段落は3行までを目安に
・文章の区切りごとに1行空ける
・話題が変わる際は2行以上空ける
・重要なポイントは独立した行に
・数字やデータは前後に空白行を入れて強調
・長い文章は適切に区切ってリズム感を持たせる
・句点「。」の後は必ず改行
・読点「、」の後でも、文が長くなる場合は適宜改行

セールスレターの展開：
1. 読者の現状や課題に共感する導入から始める
2. 問題点を具体的に掘り下げる
3. 解決策を自然な流れで提示
4. 製品の特徴とメリットを具体的に説明
5. 実際の使用例や成果を示す
6. 価格と特典を魅力的に提示
7. 行動を促す締めくくり

文体に関する注意点：
・「皆様」「みなさま」などの表現は使わず、「あなた」に直接語りかける
・「私」という表現は必要最小限に抑え、自然な文の流れを重視
・主語を省略できる場合は省略し、より自然な日本語の文章に
・提案や説明は、断定的な表現を避け、やわらかい口調を心がける`;

    const responses = await Promise.all(
      models.map(async (modelId: string) => {
        try {
          switch (modelId) {
            case 'gpt-4': {
              const completion = await openai.chat.completions.create({
                model: 'gpt-4-turbo-preview',
                messages: [
                  {
                    role: 'user',
                    content: prompt,
                  },
                ],
                temperature: 0.7,
                max_tokens: 2000,
              });
              return completion.choices[0].message.content || '';
            }

            case 'gpt-3.5-turbo': {
              const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                  {
                    role: 'user',
                    content: prompt,
                  },
                ],
                temperature: 0.7,
                max_tokens: 2000,
              });
              return completion.choices[0].message.content || '';
            }

            case 'gemini-pro': {
              const model = genAI.getGenerativeModel({ model: "gemini-pro" });
              const result = await model.generateContent(prompt);
              return result.response.text;
            }
            
            case 'claude-3-opus': {
              const message = await anthropic.messages.create({
                model: 'claude-3-opus-20240229',
                max_tokens: 4000,
                messages: [
                  {
                    role: 'user',
                    content: prompt,
                  },
                ],
              });
              return (message.content[0] as TextBlock).text;
            }

            case 'claude-3-sonnet': {
              const message = await anthropic.messages.create({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 4000,
                messages: [
                  {
                    role: 'user',
                    content: prompt,
                  },
                ],
              });
              return (message.content[0] as TextBlock).text;
            }

            default:
              throw new Error(`Unsupported model: ${modelId}`);
          }
        } catch (error) {
          console.error(`Error with model ${modelId}:`, error);
          return `${modelId}でのセールスレター生成中にエラーが発生しました。`;
        }
      })
    );

    const combinedResponse = responses.map((response, index) => {
      return `【${models[index]}による生成結果】\n\n${response}\n\n`;
    }).join('\n---\n\n');

    // データベース保存を一時的に無効化
    return NextResponse.json({ 
      salesLetter: combinedResponse
    });

  } catch (error: unknown) {
    console.error("Error generating sales letter:", error);

    return NextResponse.json({
      message: "エラーが発生しました。もう一度お試しください。",
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    }, { status: 500 });
  }
}
