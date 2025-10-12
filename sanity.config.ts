// sanity.config.ts
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schema} from './sanity/schema' // <- you already have this from earlier steps

export default defineConfig({
  projectId: 'rvmd9re9',
  dataset: 'production',
  title: 'PrintPerfect Studio',
  plugins: [deskTool(), visionTool()],
  schema,
})
