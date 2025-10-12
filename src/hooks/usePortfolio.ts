import {useEffect, useState} from 'react'
import {sanity} from '@/lib/sanity'
import {Q_PORTFOLIO} from '@/cms/queries'
import type {PortfolioItem} from '@/types/cms'

export function usePortfolio() {
  const [data, setData] = useState<PortfolioItem[]>([])

  useEffect(() => {
    sanity.fetch(Q_PORTFOLIO)
      .then(setData)
      .catch((e) => {
        if (import.meta.env.DEV) console.error('[portfolio] sanity.fetch failed:', e)
        setData([])
      })
  }, [])

  return data
}
