import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from '@anthropic-ai/sdk';

// Prismaの一時的な無効化
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log('OpenAI API Key:', process.env.OPENAI_API_KEY ? '設定されています' : '設定されていません');
console.log('Gemini API Key:', process.env.GEMINI_API_KEY ? '設定されています' : '設定されていません');
console.log('Anthropic API Key:', process.env.ANTHROPIC_API_KEY ? '設定されています' : '設定されていません');

let anthropic: Anthropic | undefined;
try {
  anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
  console.log('Anthropicクライアントの初期化に成功しました');
} catch (error) {
  console.error('Anthropicクライアントの初期化に失敗:', error);
  if (error instanceof Error) {
    console.error('初期化エラーの詳細:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
  }
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  if (!anthropic) {
    return NextResponse.json({
      message: "Anthropicクライアントの初期化に失敗しました。",
      error: "Anthropic client initialization failed"
    }, { status: 500 });
  }

  try {
    const { models, ...data } = await req.json();
    const prompt = `以下の情報を元に、ストーリー性のある魅力的なセールスレターを作成してください。
文章は自然な流れで展開し、読者に直接語りかけるような文体で書いてください。

${data.productName}は、${data.targetPersona}（${data.targetAge}、${data.targetGender}、${data.targetOccupation}）に向けた製品です。

${data.fear}
${data.agitate}

${data.solution}
${data.features}
${data.benefits}

${data.mediaExposure}
${data.testimonials}

通常価格${data.originalPrice}円のところ、特別価格${data.specialPrice}円でご提供します。
${data.bonus}（${data.bonusDeadline}まで）
${data.scarcity}
${data.urgency}

文章作成のポイント：
・読者に直接語りかける親近感のある文体を使用
・一つの段落は3行までを目安に
・文章の区切りごとに1行空ける
・話題が変わる際は2行以上空ける
・重要なポイントは独立した行に
・数字やデータは前後に空白行を入れて強調
・長い文章は適切に区切ってリズム感を持たせる
・句点「。」の後は必ず改行
・読点「、」の後でも、文が長くなる場合は適宜改行

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
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 4000,
              });
              return completion.choices[0].message.content || '';
            }

            case 'gpt-3.5-turbo': {
              const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 4000,
              });
              return completion.choices[0].message.content || '';
            }

            case 'gemini-pro': {
              try {
                const model = genAI.getGenerativeModel({ model: "gemini-pro" });
                const result = await model.generateContent(prompt);
                const response = await result.response;
                return response.text() || 'テキストの生成に失敗しました。';
              } catch (error) {
                console.error('Gemini error:', error);
                return 'Geminiでのテキスト生成に失敗しました。';
              }
            }
            
            case 'claude-3-opus': {
              try {
                console.log('Claude Opus: リクエスト開始');
                const message = await anthropic.messages.create({
                  model: 'claude-3-opus-20240229',
                  max_tokens: 4000,
                  temperature: 0.7,
                  messages: [{ role: 'user', content: prompt }],
                });
                console.log('Claude Opus: レスポンス受信', message);
                const content = message.content[0] as { type: string; text: string };
                if (content?.type === 'text') {
                  return content.text;
                }
                return 'テキスト以外のコンテンツは生成できません。';
              } catch (error) {
                console.error('Claude Opus error:', error);
                if (error instanceof Error) {
                  console.error('Claude Opus エラーの詳細:', {
                    name: error.name,
                    message: error.message,
                    stack: error.stack,
                    error: JSON.stringify(error, null, 2)
                  });
                }
                return 'Claude Opusでのテキスト生成に失敗しました。';
              }
            }

            case 'claude-3-sonnet': {
              try {
                console.log('Claude Sonnet: リクエスト開始');
                const message = await anthropic.messages.create({
                  model: 'claude-3-sonnet-20240229',
                  max_tokens: 4000,
                  temperature: 0.7,
                  messages: [{ role: 'user', content: prompt }],
                });
                console.log('Claude Sonnet: レスポンス受信', message);
                const content = message.content[0] as { type: string; text: string };
                if (content?.type === 'text') {
                  return content.text;
                }
                return 'テキスト以外のコンテンツは生成できません。';
              } catch (error) {
                console.error('Claude Sonnet error:', error);
                if (error instanceof Error) {
                  console.error('Claude Sonnet エラーの詳細:', {
                    name: error.name,
                    message: error.message,
                    stack: error.stack,
                    error: JSON.stringify(error, null, 2)
                  });
                }
                return 'Claude Sonnetでのテキスト生成に失敗しました。';
              }
            }

            default:
              throw new Error(`サポートされていないモデル: ${modelId}`);
          }
        } catch (error) {
          console.error(`${modelId}でのエラー:`, error);
          if (error instanceof Error) {
            console.error('エラーの詳細:', {
              name: error.name,
              message: error.message,
              stack: error.stack
            });
          }
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
    console.error("セールスレター生成中のエラー:", error);

    return NextResponse.json({
      message: "エラーが発生しました。もう一度お試しください。",
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    }, { status: 500 });
  }
}
