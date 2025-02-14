import OpenAI from 'openai';
// Prismaの一時的な無効化
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const requestBody = await req.json();
    console.log("Request received:", requestBody);

    const {
      productName,
      targetPersona,
      targetAge,
      targetGender,
      targetOccupation,
      fear,
      agitate,
      solution,
      features,
      benefits,
      mediaExposure,
      testimonials,
      originalPrice,
      specialPrice,
      bonus,
      bonusDeadline,
      scarcity,
      urgency
    } = requestBody;

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("Missing OpenAI API key in environment variables.");
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `
      以下の情報を元に、ストーリー性のある長めのセールスレターを作成してください。
      文章は短めに区切り、適度な改行を入れて読みやすくしてください。
      一行は30文字程度を目安にしてください。
      見出しや項目名は使用せず、自然な文章の流れで書いてください。

      【製品基本情報】
      製品名: ${productName}

      【ターゲット設定】
      想定する顧客: ${targetPersona}
      年齢: ${targetAge}
      性別: ${targetGender}
      職業: ${targetOccupation}

      【FASフレームワーク】
      Fear（恐怖・不安）: ${fear}
      Agitate（悩みの深掘り）: ${agitate}
      Solution（解決策）: ${solution}

      【製品詳細】
      主な特徴: ${features}
      具体的なメリット: ${benefits}

      【社会的証明】
      メディア掲載: ${mediaExposure}
      お客様の声1: ${testimonials}
      お客様の声2: "導入1ヶ月で家事の時間が半分に。子供と遊ぶ時間が増えて、笑顔が増えました（大阪府・山田さん）"
      お客様の声3: "帰宅したら既に掃除が完了していて、清潔な家でリラックスできます（福岡県・井上さん）"
      お客様の声4: "休日の掃除から解放され、家族で出かける時間が作れるようになりました（千葉県・中村さん）"
      お客様の声5: "花粉症持ちの私にとって、常に清潔な空間を保てるのが何よりの安心です（東京都・鈴木さん）"

      【価格と特典】
      通常価格: ${originalPrice}円
      特別価格: ${specialPrice}円
      特典: ${bonus}
      特典期限: ${bonusDeadline}

      【希少性・緊急性】
      数量限定: ${scarcity}
      期間限定: ${urgency}

      ストーリー展開のポイント：
      - 共感を呼ぶ問題提起から自然に始める
      - 典型的な一日の困りごとを時系列で詳しく描写
      - 掃除の悩みが生活の様々な面に与える影響を具体的に表現
      - 家族との大切な時間が失われている状況を感情的に描く
      - 休日や平日それぞれの課題を丁寧に描写
      - 解決策としての製品を自然な流れで紹介
      - 製品の特徴を具体的なメリットと共に詳しく説明
      - 製品導入後の生活の変化を時間軸に沿って描写
      - 複数の実際のユーザー体験を会話調で織り交ぜる
      - 製品がもたらす未来の生活をイメージ豊かに描く

      文章構成の注意点：
      - 見出しや項目名は使用しない
      - 各要素を自然な文章の流れで繋ぐ
      - 段落の切り替えを滑らかにする
      - お客様の声は会話の一部として組み込む
      - 価格や特典も文章の流れの中で自然に提示
      - 数量限定や期間限定も物語の一部として表現
      - 製品の各機能について具体的なシーンで説明
      - 導入のメリットを多角的な視点で描写
      - 家族それぞれの視点からの変化も描く

      重要な指示：
      - 一行は30文字程度で改行を入れる
      - 段落間は2行空ける
      - 情景描写を効果的に使用
      - 感情に訴えかける表現を取り入れる
      - 具体的な数字は文章の中に自然に組み込む
      - 全体を通して物語のように展開する
      - 読者の共感を引き出す表現を心がける
      - 製品の各機能を具体的なシーンで説明
      - 朝・昼・夜それぞれの生活シーンを描写
      - 休日と平日の変化を対比して表現
      - 季節ごとの効果や変化も盛り込む
      - 長期的な効果やメリットも説明

      セールスレターの目安の長さ：
      - 導入部分：400-500文字
      - 問題提起と深掘り：600-700文字
      - 解決策の提示：500-600文字
      - 製品説明と特徴：700-800文字
      - 使用例とメリット：600-700文字
      - お客様の声：500-600文字
      - 価格と特典の説明：400-500文字
      - まとめと行動喚起：300-400文字
      合計：4000-4800文字程度
    `;

    console.log("Prompt:", prompt);

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a professional copywriter specialized in writing persuasive sales letters. Create a detailed and engaging sales letter with rich storytelling and specific examples." },
        { role: "user", content: prompt }
      ],
      max_tokens: 2500,
      temperature: 0.7,
    });

    console.log("OpenAI Response:", response);

    const salesLetter = response?.choices?.[0]?.message?.content?.trim();

    if (!salesLetter) {
      throw new Error("OpenAI API response is empty.");
    }

    // データベース保存を一時的に無効化
    return new Response(JSON.stringify({ 
      salesLetter
    }), {
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
