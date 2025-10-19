import {useEffect, useState} from 'react'
import {sanity} from '@/lib/sanity'
import {Q_SERVICES} from '@/cms/queries'
import type {Service} from '@/types/cms'

export function useServices() {
  const [data, setData] = useState<Service[]>([])

  useEffect(() => {
    sanity.fetch(Q_SERVICES)
      .then((result) => {
        if (Array.isArray(result)) {
          setData(result)
        } else {
          setData([])
        }
      })
      .catch((e) => {
        if (import.meta.env.DEV) console.error('[services] sanity.fetch failed:', e)
        setData([])
      })
  }, [])

  return data
}
