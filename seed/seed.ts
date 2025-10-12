import fs from 'node:fs/promises'
import path from 'node:path'
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: 'production',
  apiVersion: '2023-10-01',
  token: process.env.SANITY_TOKEN!,
  useCdn: false,
})

function idFrom(o: any, type: 'service' | 'portfolioItem') {
  const base = (o.title || o.category || 'x')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
  return `${type}-${base}-${o.priority ?? 0}`
}

async function uploadImage(p: string) {
  const buf = await fs.readFile(p)
  const asset = await client.assets.upload('image', buf, {filename: path.basename(p)})
  return {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}
}

async function seedOne(jsonPath: string, assetsDir: string, type: 'service' | 'portfolioItem') {
  const items = JSON.parse(await fs.readFile(jsonPath, 'utf8'))
  for (const it of items) {
    const img = await uploadImage(path.join(assetsDir, String(it.image)))
    const doc = {...it, image: img, filters: it.filters ?? [], categorySlugs: it.categorySlugs ?? []}
    await client.createOrReplace({_id: idFrom(doc, type), _type: type, ...doc})
    console.log('Upserted', type, doc.title)
  }
}

await seedOne('seed/data/services.json', 'seed/assets/services', 'service')
await seedOne('seed/data/portfolio.json', 'seed/assets/portfolio', 'portfolioItem')
console.log('Seed complete')
