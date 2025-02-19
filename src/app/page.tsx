'use client'

import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import Link from "next/link";
import { Checkbox } from "../components/ui/checkbox";

interface AIModel {
  id: string;
  name: string;
  description: string;
  isSelected: boolean;
}

export default function Home() {
  // AIモデル選択
  const [aiModels, setAiModels] = useState<AIModel[]>([
    {
      id: "gpt-4",
      name: "GPT-4",
      description: "OpenAIの最高性能モデル。複雑な文章生成と高度な理解力が特徴。",
      isSelected: true
    },
    {
      id: "gpt-3.5-turbo",
      name: "GPT-3.5 Turbo",
      description: "高速な処理と優れたコストパフォーマンスが特徴。",
      isSelected: false
    },
    {
      id: "gemini-pro",
      name: "Gemini Pro",
      description: "Googleの最新AIモデル。高速で正確な文章生成が特徴。",
      isSelected: false
    },
    {
      id: "claude-3-opus",
      name: "Claude 3 Opus",
      description: "Anthropicの最新AIモデル。詳細な分析と長文生成に優れる。",
      isSelected: false
    },
    {
      id: "claude-3-sonnet",
      name: "Claude 3 Sonnet",
      description: "高速な処理と高品質な出力のバランスが特徴。",
      isSelected: false
    }
  ]);

  // 基本情報
  const [productName, setProductName] = useState("スマート掃除ロボット");
  
  // ターゲット設定
  const [targetPersona, setTargetPersona] = useState("仕事で忙しい30代の共働き夫婦");
  const [targetAge, setTargetAge] = useState("30-40代");
  const [targetGender, setTargetGender] = useState("男女");
  const [targetOccupation, setTargetOccupation] = useState("会社員");
  
  // FASフレームワーク
  const [fear, setFear] = useState("掃除の時間が取れず、家の衛生状態が心配");
  const [agitate, setAgitate] = useState("休日も掃除に追われ、家族との時間が減少。ストレスも蓄積");
  const [solution, setSolution] = useState("AI搭載の最新スマート掃除ロボット");
  
  // 製品詳細
  const [features, setFeatures] = useState("AI搭載で自動清掃、スマホ操作可能、省エネ設計");
  const [benefits, setBenefits] = useState("掃除時間を90%削減、家族との時間を創出");
  
  // 社会的証明
  const [mediaExposure, setMediaExposure] = useState("日経トレンディで注目商品に選出！");
  const [testimonials, setTestimonials] = useState("導入後、休日の家族時間が2倍に！（東京都・佐藤さん）");
  
  // 価格と特典
  const [originalPrice, setOriginalPrice] = useState("89,800");
  const [specialPrice, setSpecialPrice] = useState("49,800");
  const [bonus, setBonus] = useState("1年間の無料メンテナンス付き");
  const [bonusDeadline, setBonusDeadline] = useState("今週末まで");
  
  // 希少性・緊急性
  const [scarcity, setScarcity] = useState("初回限定100台");
  const [urgency, setUrgency] = useState("本日23時59分まで");

  const [salesLetter, setSalesLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setter: (value: string) => void
  ) => {
    setter(e.target.value);
  };

  const handleModelSelect = (modelId: string) => {
    setAiModels(aiModels.map(model => ({
      ...model,
      isSelected: model.id === modelId ? !model.isSelected : model.isSelected
    })));
  };

  const generateSalesLetter = async () => {
    setLoading(true);
    try {
      const selectedModels = aiModels.filter(model => model.isSelected).map(model => model.id);
      
      if (selectedModels.length === 0) {
        setSalesLetter("AIモデルを少なくとも1つ選択してください。");
        setLoading(false);
        return;
      }

      const body = JSON.stringify({
        models: selectedModels,
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
        urgency,
      });

      const response = await fetch('/api/generate-sales-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      const data = await response.json();
      setSalesLetter(data.salesLetter || "エラーが発生しました。もう一度お試しください。");
    } catch (error) {
      console.error("Error generating sales letter:", error);
      setSalesLetter("エラーが発生しました。もう一度お試しください。");
    }

    setLoading(false);
  };

  const saveSalesPage = async () => {
    if (!salesLetter) {
      setSaveStatus("先にセールスページを生成してください");
      return;
    }

    try {
      const response = await fetch('/api/save-sales-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
          urgency,
          salesLetter,
        }),
      });

      const data = await response.json();
      setSaveStatus(data.message);

      // 3秒後にステータスメッセージをクリア
      setTimeout(() => {
        setSaveStatus("");
      }, 3000);

    } catch (error) {
      console.error("Error saving sales page:", error);
      setSaveStatus("保存中にエラーが発生しました");
    }
  };

  return (
    <>
      <div className="container mx-auto p-8 font-sans">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">セールスページAIエージェント</h1>
          <Link href="/saved">
            <Button variant="outline">
              保存したセールスページ一覧
            </Button>
          </Link>
        </div>
        <Card className="p-6">
          <CardContent>
            <div className="space-y-4">
              {/* 基本情報 */}
              <div className="border-b pb-4">
                <h2 className="text-xl font-semibold mb-4">基本情報</h2>
                <label className="block">
                  <span className="text-gray-700">製品名</span>
                  <Input 
                    type="text" 
                    value={productName} 
                    onChange={(e) => handleInputChange(e, setProductName)} 
                  />
                </label>
              </div>

              {/* ターゲット設定 */}
              <div className="border-b pb-4">
                <h2 className="text-xl font-semibold mb-4">ターゲット設定</h2>
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-gray-700">想定する顧客</span>
                    <Input 
                      type="text" 
                      value={targetPersona} 
                      onChange={(e) => handleInputChange(e, setTargetPersona)} 
                    />
                  </label>
                  <label className="block">
                    <span className="text-gray-700">年齢層</span>
                    <Input 
                      type="text" 
                      value={targetAge} 
                      onChange={(e) => handleInputChange(e, setTargetAge)} 
                    />
                  </label>
                  <label className="block">
                    <span className="text-gray-700">性別</span>
                    <Input 
                      type="text" 
                      value={targetGender} 
                      onChange={(e) => handleInputChange(e, setTargetGender)} 
                    />
                  </label>
                  <label className="block">
                    <span className="text-gray-700">職業</span>
                    <Input 
                      type="text" 
                      value={targetOccupation} 
                      onChange={(e) => handleInputChange(e, setTargetOccupation)} 
                    />
                  </label>
                </div>
              </div>

              {/* FASフレームワーク */}
              <div className="border-b pb-4">
                <h2 className="text-xl font-semibold mb-4">FASフレームワーク</h2>
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-gray-700">不安要素</span>
                    <Textarea 
                      value={fear} 
                      onChange={(e) => handleInputChange(e, setFear)} 
                    />
                  </label>
                  <label className="block">
                    <span className="text-gray-700">問題の深掘り</span>
                    <Textarea 
                      value={agitate} 
                      onChange={(e) => handleInputChange(e, setAgitate)} 
                    />
                  </label>
                  <label className="block">
                    <span className="text-gray-700">解決策</span>
                    <Textarea 
                      value={solution} 
                      onChange={(e) => handleInputChange(e, setSolution)} 
                    />
                  </label>
                </div>
              </div>

              {/* 製品詳細 */}
              <div className="border-b pb-4">
                <h2 className="text-xl font-semibold mb-4">製品詳細</h2>
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-gray-700">主な特徴</span>
                    <Textarea 
                      value={features} 
                      onChange={(e) => handleInputChange(e, setFeatures)} 
                    />
                  </label>
                  <label className="block">
                    <span className="text-gray-700">具体的なメリット</span>
                    <Textarea 
                      value={benefits} 
                      onChange={(e) => handleInputChange(e, setBenefits)} 
                    />
                  </label>
                </div>
              </div>

              {/* 社会的証明 */}
              <div className="border-b pb-4">
                <h2 className="text-xl font-semibold mb-4">社会的証明</h2>
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-gray-700">メディア掲載実績</span>
                    <Input 
                      type="text" 
                      value={mediaExposure} 
                      onChange={(e) => handleInputChange(e, setMediaExposure)} 
                    />
                  </label>
                  <label className="block">
                    <span className="text-gray-700">お客様の声</span>
                    <Textarea 
                      value={testimonials} 
                      onChange={(e) => handleInputChange(e, setTestimonials)} 
                    />
                  </label>
                </div>
              </div>

              {/* 価格と特典 */}
              <div className="border-b pb-4">
                <h2 className="text-xl font-semibold mb-4">価格と特典</h2>
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-gray-700">通常価格</span>
                    <Input 
                      type="text" 
                      value={originalPrice} 
                      onChange={(e) => handleInputChange(e, setOriginalPrice)} 
                    />
                  </label>
                  <label className="block">
                    <span className="text-gray-700">特別価格</span>
                    <Input 
                      type="text" 
                      value={specialPrice} 
                      onChange={(e) => handleInputChange(e, setSpecialPrice)} 
                    />
                  </label>
                  <label className="block">
                    <span className="text-gray-700">特典内容</span>
                    <Input 
                      type="text" 
                      value={bonus} 
                      onChange={(e) => handleInputChange(e, setBonus)} 
                    />
                  </label>
                  <label className="block">
                    <span className="text-gray-700">特典期限</span>
                    <Input 
                      type="text" 
                      value={bonusDeadline} 
                      onChange={(e) => handleInputChange(e, setBonusDeadline)} 
                    />
                  </label>
                </div>
              </div>

              {/* 希少性・緊急性 */}
              <div className="border-b pb-4">
                <h2 className="text-xl font-semibold mb-4">希少性・緊急性</h2>
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-gray-700">数量限定</span>
                    <Input 
                      type="text" 
                      value={scarcity} 
                      onChange={(e) => handleInputChange(e, setScarcity)} 
                    />
                  </label>
                  <label className="block">
                    <span className="text-gray-700">期間限定</span>
                    <Input 
                      type="text" 
                      value={urgency} 
                      onChange={(e) => handleInputChange(e, setUrgency)} 
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  type="button" 
                  onClick={generateSalesLetter} 
                  disabled={loading}
                  className="w-full mb-2"
                >
                  {loading ? "生成中..." : "セールスページを生成"}
                </Button>

                {salesLetter && (
                  <Button
                    type="button"
                    onClick={saveSalesPage}
                    className="w-full"
                    variant="outline"
                  >
                    セールスページを保存
                  </Button>
                )}

                {saveStatus && (
                  <div className="text-center mt-2 text-sm text-gray-600">
                    {saveStatus}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6 mb-6">
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">AIモデル選択</h2>
            <div className="space-y-4">
              {aiModels.map((model) => (
                <div key={model.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={model.id}
                    checked={model.isSelected}
                    onCheckedChange={() => handleModelSelect(model.id)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor={model.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {model.name}
                    </label>
                    <p className="text-sm text-gray-500">
                      {model.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {salesLetter && (
          <Card className="mt-6 p-6 bg-gray-100 border">
            <CardContent>
              <h2 className="text-2xl font-semibold mb-4">生成されたセールスレター</h2>
              <div 
                className="whitespace-pre-wrap prose prose-lg max-w-none"
                style={{
                  lineHeight: '2.2',
                  fontSize: '1.1rem',
                  letterSpacing: '0.8px',
                  maxWidth: '38em',
                  margin: '0 auto',
                  padding: '1rem'
                }}
              >
                {salesLetter}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
