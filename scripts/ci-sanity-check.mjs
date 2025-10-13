const PROJECT = process.env.SANITY_PROJECT_ID || 'rvmd9re9';
const DATASET = process.env.SANITY_DATASET || 'production';
const TOKEN   = process.env.SANITY_TOKEN || '';
const API_VERSION = '2023-10-01';

if (!PROJECT || !DATASET) {
  console.error('❌ Missing SANITY_PROJECT_ID or SANITY_DATASET');
  process.exit(1);
}

async function q(query) {
  const url = `https://${PROJECT}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : undefined });
  if (!res.ok) throw new Error(`Sanity query failed: HTTP ${res.status} ${await res.text()}`);
  return (await res.json()).result;
}

(async () => {
  try {
    const services = await q('count(*[_type=="service"])');
    const portfolio = await q('count(*[_type=="portfolioItem"])');
    console.log(`ℹ︎ serviceCount=${services}, portfolioCount=${portfolio}`);
    if (!(services > 0 && portfolio > 0)) throw new Error('Sanity data gate failed: counts must be > 0');
    console.log('✅ Sanity dataset has non-zero Services and Portfolio.');
  } catch (e) { console.error('❌', e.message || e); process.exit(1); }
})();
