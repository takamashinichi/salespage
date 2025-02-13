import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    // リクエストの JSON を取得
    const requestBody = await req.json();
    console.log("Request received:", requestBody);

    const { productName, problem, fear, solution, features, originalPrice, specialPrice, bonus, scarcity } = requestBody;

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("Missing OpenAI API key in environment variables.");
    }

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

      キャッチーなヘッドコピー（読者の注意を引く）
      問題提起（ユーザーの悩みと恐怖を強調）
      解決策の提示（製品の紹介）
      製品の特徴とベネフィットの説明（分かりやすく整理）
      価格の提示（価値を伝えた後に記載）
      保証・特典の紹介（信頼性向上のため）
      強力なCTA（行動を促す文言）
      追伸（希少性や限定性を強調して申し込みを後押し）
    `;

    console.log("Prompt:", prompt);

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt }
      ],
      max_tokens: 1000,
    });

    console.log("OpenAI Response:", response);

    // OpenAI のレスポンスを安全に取得
    const salesLetter = response?.choices?.[0]?.message?.content?.trim();

    if (!salesLetter) {
      throw new Error("OpenAI API response is empty.");
    }

    return new Response(JSON.stringify({ salesLetter }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error generating sales letter:", error);

    return new Response(JSON.stringify({
      message: "エラーが発生しました。もう一度お試しください。",
      error: (error as any).message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
