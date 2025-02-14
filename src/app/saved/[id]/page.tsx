'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Card, CardContent } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"

interface SalesPage {
  id: number
  productName: string
  createdAt: string
  targetPersona: string
  targetAge: string
  targetGender: string
  targetOccupation: string
  fear: string
  agitate: string
  solution: string
  features: string
  benefits: string
  mediaExposure: string
  testimonials: string
  originalPrice: string
  specialPrice: string
  bonus: string
  bonusDeadline: string
  scarcity: string
  urgency: string
  salesLetter: string
}

export default function SalesPageDetail() {
  const params = useParams()
  const [salesPage, setSalesPage] = useState<SalesPage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSalesPage = async () => {
      try {
        const response = await fetch(`/api/get-sales-page/${params.id}`)
        const data = await response.json()
        setSalesPage(data.salesPage)
      } catch (error) {
        console.error('Error fetching sales page:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSalesPage()
  }, [params.id])

  if (loading) return <div className="container mx-auto p-8">読み込み中...</div>
  if (!salesPage) return <div className="container mx-auto p-8">セールスページが見つかりません。</div>

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{salesPage.productName}</h1>
        <div className="space-x-4">
          <Link href="/saved">
            <Button variant="outline">一覧に戻る</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">トップページに戻る</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">基本情報</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">作成日</p>
                <p>{new Date(salesPage.createdAt).toLocaleDateString('ja-JP')}</p>
              </div>
              <div>
                <p className="text-gray-600">ターゲット</p>
                <p>{salesPage.targetPersona}</p>
              </div>
              <div>
                <p className="text-gray-600">年齢層</p>
                <p>{salesPage.targetAge}</p>
              </div>
              <div>
                <p className="text-gray-600">性別</p>
                <p>{salesPage.targetGender}</p>
              </div>
              <div>
                <p className="text-gray-600">職業</p>
                <p>{salesPage.targetOccupation}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">セールスレター</h2>
            <div 
              className="whitespace-pre-wrap prose prose-lg max-w-none"
              style={{
                lineHeight: '2.2',
                fontSize: '1.1rem',
                letterSpacing: '0.8px'
              }}
            >
              {salesPage.salesLetter}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">その他の情報</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">不安要素</p>
                <p>{salesPage.fear}</p>
              </div>
              <div>
                <p className="text-gray-600">問題の深掘り</p>
                <p>{salesPage.agitate}</p>
              </div>
              <div>
                <p className="text-gray-600">解決策</p>
                <p>{salesPage.solution}</p>
              </div>
              <div>
                <p className="text-gray-600">特徴</p>
                <p>{salesPage.features}</p>
              </div>
              <div>
                <p className="text-gray-600">メリット</p>
                <p>{salesPage.benefits}</p>
              </div>
              <div>
                <p className="text-gray-600">メディア掲載</p>
                <p>{salesPage.mediaExposure}</p>
              </div>
              <div>
                <p className="text-gray-600">お客様の声</p>
                <p>{salesPage.testimonials}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">価格・特典情報</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">通常価格</p>
                <p>{salesPage.originalPrice}円</p>
              </div>
              <div>
                <p className="text-gray-600">特別価格</p>
                <p>{salesPage.specialPrice}円</p>
              </div>
              <div>
                <p className="text-gray-600">特典</p>
                <p>{salesPage.bonus}</p>
              </div>
              <div>
                <p className="text-gray-600">特典期限</p>
                <p>{salesPage.bonusDeadline}</p>
              </div>
              <div>
                <p className="text-gray-600">数量限定</p>
                <p>{salesPage.scarcity}</p>
              </div>
              <div>
                <p className="text-gray-600">期間限定</p>
                <p>{salesPage.urgency}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 