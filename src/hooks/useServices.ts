import {useEffect, useState} from 'react'
import {sanity} from '@/lib/sanity'
import {Q_SERVICES} from '@/cms/queries'
import type {Service} from '@/types/cms'

export function useServices() {
  const [data, setData] = useState<Service[]>([])

  useEffect(() => {
    sanity.fetch<Service[]>(Q_SERVICES).then(setData)
  }, [])

  return data
}
