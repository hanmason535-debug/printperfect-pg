/**
 * sanity/client.ts
 *
 * Configures and exports the Sanity client for fetching data.
 */
import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  useCdn: true, // `false` if you want to ensure fresh data
  apiVersion: '2024-07-15', // use a UTC date in YYYY-MM-DD format
});