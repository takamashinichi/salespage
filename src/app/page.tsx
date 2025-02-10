'use client'

import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input, } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import OpenAI from "openai";

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [productName, setProductName] = useState("スマート掃除ロボット");
  const [problem, setProblem] = useState("毎日の掃除が面倒で時間がかかる");
  const [fear, setFear] = useState("部屋が汚れ放題になり、健康にも悪影響");
  const [solution, setSolution] = useState("最新のスマート掃除ロボット");
  const [features, setFeatures] = useState("AI搭載で自動清掃、スマホ操作可能、省エネ設計");
  const [originalPrice, setOriginalPrice] = useState("89,800");
  const [specialPrice, setSpecialPrice] = useState("49,800");
  const [bonus, setBonus] = useState("1年間の無料メンテナンス");
  const [scarcity, setScarcity] = useState("限定100台、今すぐご注文を！");
  const [salesLetter, setSalesLetter] = useState("");
  const [loading, setLoading] = useState(false);

  const generateSalesLetter = async () => {
    if (!apiKey) {
      setSalesLetter("APIキーを入力してください。");
      return;
    }

    setLoading(true);
    const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

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

      setSalesLetter(response.choices[0]?.message?.content?.trim() || "エラーが発生しました。もう一度お試しください。");
    } catch (error) {
      console.error("Error generating sales letter:", error);
      setSalesLetter("エラーが発生しました。もう一度お試しください。");
    }

    setLoading(false);
  };

  return (
    <div className="container mx-auto p-8 font-sans">
      <h1 className="text-3xl font-bold mb-4">セールスページAIエージェント</h1>
      <Card className="p-6">
        <CardContent>
          <div className="space-y-4">
            <Input type="text" placeholder="OpenAI APIキーを入力" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            <Input type="text" placeholder="製品名を入力" value={productName} onChange={(e) => setProductName(e.target.value)} />
            <Input type="text" placeholder="ユーザーの悩みを入力" value={problem} onChange={(e) => setProblem(e.target.value)} />
            <Input type="text" placeholder="恐怖の要素を入力" value={fear} onChange={(e) => setFear(e.target.value)} />
            <Input type="text" placeholder="解決策を入力" value={solution} onChange={(e) => setSolution(e.target.value)} />
            <Input type="text" placeholder="主な特徴を入力" value={features} onChange={(e) => setFeatures(e.target.value)} />
            <Input type="text" placeholder="通常価格を入力" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} />
            <Input type="text" placeholder="特別価格を入力" value={specialPrice} onChange={(e) => setSpecialPrice(e.target.value)} />
            <Input type="text" placeholder="特典を入力" value={bonus} onChange={(e) => setBonus(e.target.value)} />
            <Input type="text" placeholder="希少性を入力" value={scarcity} onChange={(e) => setScarcity(e.target.value)} />
            <Button type="button" onClick={generateSalesLetter} disabled={loading}>{loading ? "生成中..." : "セールスページを生成"}</Button>
          </div>
        </CardContent>
      </Card>
      {salesLetter && (
        <Card className="mt-6 p-6 bg-gray-100 border">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-2">生成されたセールスレター</h2>
            <pre className="whitespace-pre-wrap">{salesLetter}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
