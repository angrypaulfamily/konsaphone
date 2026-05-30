#!/usr/bin/env node
// Run: node scripts/migrate-phones.mjs
// Prereq: sqlite3 CLI export already done to /tmp/phones_raw.json

import { readFileSync } from 'fs'

const SUPABASE_URL = 'https://csnkrzvnfcxfneabfbao.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzbmtyenZuZmN4Zm5lYWJmYmFvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDA0MDg5MiwiZXhwIjoyMDk1NjE2ODkyfQ.spD1mN5OLTJVPm7TNS19DnR4reccrVeFJh4loO-oOAg'

const HEADERS = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
}

// --- parsers ---

function parseGB(str) {
  const m = str?.match(/^(\d+)/)
  return m ? parseInt(m[1]) : null
}

function parseMah(str) {
  const m = str?.match(/(\d+)\s*mAh/)
  return m ? parseInt(m[1]) : null
}

function parseWatts(str) {
  // "45W wired" "25W wired, PD3.0..." → 45, 25
  const m = str?.match(/^(\d+)W/)
  return m ? parseInt(m[1]) : 10
}

function parseDisplaySize(str) {
  const m = str?.match(/^([\d.]+)\s*inches/)
  return m ? parseFloat(m[1]) : null
}

function parseHz(str) {
  const m = str?.match(/(\d+)Hz/)
  return m ? parseInt(m[1]) : 60
}

function parseDisplayType(str) {
  if (!str) return 'LCD'
  return str.split(',')[0].trim()
}

function parseCameraMP(desc) {
  if (!desc) return 8
  const m = desc.match(/(\d+)\s*MP/)
  return m ? parseInt(m[1]) : 8
}

function parseLowerPrice(str) {
  if (!str) return null
  // "₹15,000-₹35,000" or "₹1,00,000-₹1,50,000"
  // Strip ₹ and commas, grab first number sequence
  const cleaned = str.replace(/₹/g, '').replace(/,/g, '')
  const m = cleaned.match(/(\d+)/)
  return m ? parseInt(m[1]) : null
}

function mapBestFor(bracket) {
  const map = {
    budget: 'Budget buyers',
    mid_budget: 'Value seekers',
    mid_range: 'All-around use',
    upper_mid_range: 'Power users',
    flagship: 'Flagship',
    premium: 'Enthusiasts',
  }
  return map[bracket] || null
}

// --- load + parse ---

const raw = JSON.parse(readFileSync('/tmp/phones_raw.json', 'utf8'))

const phones = raw
  .filter(p => p.in_stock === 1 && p.price_estimate)
  .map(p => {
    // Note: ram and storage columns are SWAPPED in the source DB
    // p.ram = storage capacity (e.g. "128GB")
    // p.storage = RAM (e.g. "8GB")
    const ram_gb = parseGB(p.storage)
    const storage_gb = parseGB(p.ram)
    const battery_mah = parseMah(p.battery_size)
    const price_inr = parseLowerPrice(p.price_estimate)
    const display_size_inch = parseDisplaySize(p.display_size)

    return {
      name: p.full_name,
      brand: p.brand,
      processor: p.chipset || '',
      price_inr,
      ram_gb,
      storage_gb,
      camera_mp: parseCameraMP(p.main_cam_desc),
      front_camera_mp: parseCameraMP(p.selfie_cam_desc),
      battery_mah,
      charging_w: parseWatts(p.charging),
      display_size_inch,
      display_hz: parseHz(p.display_hz || p.display_type),
      display_type: parseDisplayType(p.display_type),
      has_5g: (p.network || '').includes('5G'),
      best_for: [],
      plain_camera_verdict: null,
      plain_battery_verdict: null,
      plain_gaming_verdict: null,
      flipkart_url: null,
      amazon_url: null,
      launch_date: p.launch_date
        ? p.launch_date.length === 4
          ? p.launch_date + '-01-01'
          : p.launch_date.length === 7
          ? p.launch_date + '-01'
          : p.launch_date
        : null,
    }
  })
  .filter(p => p.price_inr && p.ram_gb && p.storage_gb && p.battery_mah && p.display_size_inch && p.display_size_inch < 9.5)

console.log(`Prepared ${phones.length} phones from ${raw.length} total`)

// --- preview first 3 ---
console.log('\nSample parsed phones:')
phones.slice(0, 3).forEach(p => {
  console.log(`  ${p.name} | ₹${p.price_inr?.toLocaleString()} | ${p.ram_gb}GB RAM | ${p.storage_gb}GB storage | ${p.battery_mah}mAh | ${p.charging_w}W | ${p.display_hz}Hz | 5G:${p.has_5g}`)
})

// --- step 1: delete all existing phones ---
console.log('\nDeleting existing phones from Supabase...')
const delRes = await fetch(
  `${SUPABASE_URL}/rest/v1/phones?price_inr=gte.0`,
  { method: 'DELETE', headers: HEADERS }
)
// Also delete phones with null price (catch-all)
await fetch(
  `${SUPABASE_URL}/rest/v1/phones?price_inr=is.null`,
  { method: 'DELETE', headers: HEADERS }
)
if (!delRes.ok) {
  console.error('Delete failed:', await delRes.text())
  process.exit(1)
}
console.log('Deleted existing phones.')

// --- step 2: insert in batches ---
const BATCH = 50
let inserted = 0
for (let i = 0; i < phones.length; i += BATCH) {
  const batch = phones.slice(i, i + BATCH)
  const res = await fetch(`${SUPABASE_URL}/rest/v1/phones`, {
    method: 'POST',
    headers: { ...HEADERS, 'Prefer': 'return=minimal' },
    body: JSON.stringify(batch),
  })
  if (!res.ok) {
    const err = await res.text()
    console.error(`Batch ${Math.floor(i / BATCH) + 1} FAILED:`, err)
    process.exit(1)
  }
  inserted += batch.length
  process.stdout.write(`\rInserted ${inserted}/${phones.length} phones...`)
}
console.log('\nDone!')
