'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button"

interface SalesPage {
  id: number
  productName: string
  createdAt: string
  targetPersona: string
  salesLetter: string
}

export default function SavedPages() {
  const [salesPages, setSalesPages] = useState<SalesPage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSalesPages = async () => {
      try {
        const response = await fetch('/api/get-sales-pages')
        const data = await response.json()
        setSalesPages(data.salesPages)
      } catch (error) {
        console.error('Error fetching sales pages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSalesPages()
  }, [])

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">保存されたセールスページ一覧</h1>
        <Link href="/">
          <Button variant="outline">トップページに戻る</Button>
        </Link>
      </div>

      {loading ? (
        <p>読み込み中...</p>
      ) : salesPages.length === 0 ? (
        <p>保存されたセールスページはありません。</p>
      ) : (
        <div className="grid gap-6">
          {salesPages.map((page) => (
            <Card key={page.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold mb-2">{page.productName}</h2>
                    <p className="text-gray-600 mb-2">ターゲット: {page.targetPersona}</p>
                    <p className="text-gray-500 text-sm">
                      作成日: {new Date(page.createdAt).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                  <Link href={`/saved/${page.id}`}>
                    <Button>詳細を見る</Button>
                  </Link>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="line-clamp-3 text-gray-700">
                    {page.salesLetter.substring(0, 200)}...
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 