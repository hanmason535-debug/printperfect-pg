import {useEffect, useState} from 'react'
import {sanity} from '@/lib/sanity'
import {Q_PORTFOLIO} from '@/cms/queries'
import type {PortfolioItem} from '@/types/cms'

export function usePortfolio() {
  const [data, setData] = useState<PortfolioItem[]>([])

  useEffect(() => {
    sanity.fetch<PortfolioItem[]>(Q_PORTFOLIO).then(setData)
  }, [])

  return data
}
