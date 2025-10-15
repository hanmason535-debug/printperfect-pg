import { createClient } from '@sanity/client'

const projectId = process.env.VITE_SANITY_PROJECT_ID
const dataset = process.env.VITE_SANITY_DATASET || 'production'

if (!projectId) {
  console.log('[sanity-healthcheck] Skipping: VITE_SANITY_PROJECT_ID not set')
  process.exit(0)
}

const sanity = createClient({ projectId, dataset, apiVersion: '2023-10-01', useCdn: true })

async function main() {
  const [servicesCount, portfolioCount] = await Promise.all([
    sanity.fetch('*[ _type == "service" ] | count()'),
    sanity.fetch('*[ _type == "portfolioItem" ] | count()'),
  ])

  const report = { servicesCount, portfolioCount, timestamp: new Date().toISOString() }
  console.log('[sanity-healthcheck]', report)

  const minServices = 1
  const minPortfolio = 1
  if (servicesCount < minServices || portfolioCount < minPortfolio) {
    console.error('[sanity-healthcheck] Threshold not met', { servicesCount, portfolioCount })
    process.exit(2)
  }
}

main().catch((err) => {
  console.error('[sanity-healthcheck] error', err)
  process.exit(1)
})

