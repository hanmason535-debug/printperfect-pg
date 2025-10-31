import {useEffect, useState} from 'react'
import {sanity} from '@/lib/sanity'
import {Q_SERVICES} from '@/cms/queries'
import type {Service} from '@/types/cms'

export function useServices() {
  const [data, setData] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    
    sanity
      .fetch(Q_SERVICES)
      .then((services) => {
        setData(services)
        setError(null)
      })
      .catch((e) => {
        if (import.meta.env.DEV) console.error('[services] sanity.fetch failed:', e)
        setError(e instanceof Error ? e : new Error('Failed to load services'))
        setData([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { data, loading, error }
}
