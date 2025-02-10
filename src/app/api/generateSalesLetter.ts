import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { productName, problem, fear, solution, features, originalPrice, specialPrice, bonus, scarcity } = req.body;

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `
    製品名: ${productName}
    ユーザーの悩み: ${problem}
    恐怖の要素: ${fear}
    解決策: ${solution}
    主な特徴: ${features}
    通常価格: ${originalPrice}円
    特別価格: ${specialPrice}円
    特典: ${bonus}
    希少性: ${scarcity}
    
    セールスレターを以下の流れに沿って作成してください：
    1. キャッチーなヘッドコピー（読者の注意を引く）
    2. 問題提起（ユーザーの悩みと恐怖を強調）
    3. 解決策の提示（製品の紹介）
    4. 製品の特徴とベネフィットの説明（分かりやすく整理）
    5. 価格の提示（価値を伝えた後に記載）
    6. 保証・特典の紹介（信頼性向上のため）
    7. 強力なCTA（行動を促す文言）
    8. 追伸（希少性や限定性を強調して申し込みを後押し）
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt }
      ],
      max_tokens: 700,
    });

    res.status(200).json({ salesLetter: response.choices[0]?.message?.content?.trim() || "エラーが発生しました。もう一度お試しください。" });
  } catch (error) {
    console.error("Error generating sales letter:", error);
    res.status(500).json({ message: "エラーが発生しました。もう一度お試しください。" });
  }
}
