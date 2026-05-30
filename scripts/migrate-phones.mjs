#!/usr/bin/env node
// Run: node scripts/migrate-phones.mjs
// Prereq: sqlite3 /path/to/phones.db -json "SELECT * FROM phones WHERE in_stock=1" > /tmp/phones_raw.json

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
  const cleaned = str.replace(/₹/g, '').replace(/,/g, '')
  const m = cleaned.match(/(\d+)/)
  return m ? parseInt(m[1]) : null
}

function parseWeight(str) {
  const m = str?.match(/^(\d+)\s*g/)
  return m ? parseInt(m[1]) : null
}

function parseIP(str) {
  if (!str) return null
  const m = str.match(/^IP\d+/)
  return m ? m[0] : null
}

function parseCardSlot(str) {
  if (!str) return 'Unknown'
  return str.toLowerCase().includes('microsd') ? 'Yes' : 'No'
}

function parseOS(str) {
  if (!str) return null
  const androidMatch = str.match(/Android\s+[\d.]+/)
  const uiMatch = str.match(/(One UI|MIUI|HyperOS|ColorOS|OxygenOS|FunTouch|MagicOS|realme UI|ZenUI|MyUX|Hello UI|OriginOS)\s*[\d.]*/i)
  if (androidMatch && uiMatch) return `${androidMatch[0]}, ${uiMatch[0].trim()}`
  if (androidMatch) return androidMatch[0]
  return str.split(',')[0].trim()
}

function parseLaunchDate(str) {
  if (!str) return null
  if (str.length === 4) return str + '-01-01'   // "2025"
  if (str.length === 7) return str + '-01'       // "2026-03"
  return str                                      // "2026-04-09"
}

// --- load + parse ---

const raw = JSON.parse(readFileSync('/tmp/phones_raw.json', 'utf8'))

const phones = raw
  .filter(p => p.in_stock === 1 && p.price_estimate)
  .map(p => {
    // Note: ram and storage columns are SWAPPED in the source DB
    // p.ram holds storage capacity (e.g. "128GB")
    // p.storage holds RAM (e.g. "8GB")
    return {
      name: p.full_name,
      brand: p.brand,
      processor: p.chipset || '',
      price_inr: parseLowerPrice(p.price_estimate),
      ram_gb: parseGB(p.storage),
      storage_gb: parseGB(p.ram),
      camera_mp: parseCameraMP(p.main_cam_desc),
      front_camera_mp: parseCameraMP(p.selfie_cam_desc),
      battery_mah: parseMah(p.battery_size),
      charging_w: parseWatts(p.charging),
      display_size_inch: parseDisplaySize(p.display_size),
      display_hz: parseHz(p.display_hz || p.display_type),
      display_type: parseDisplayType(p.display_type),
      has_5g: (p.network || '').includes('5G'),
      best_for: [],
      plain_camera_verdict: null,
      plain_battery_verdict: null,
      plain_gaming_verdict: null,
      flipkart_url: null,
      amazon_url: null,
      launch_date: parseLaunchDate(p.launch_date),
      reddit_sentiment: p.reddit_sentiment || null,
      reddit_praise: p.reddit_praise || null,
      reddit_complaints: p.reddit_complaints || null,
      os: parseOS(p.os),
      sw_label: p.sw_label || null,
      sw_until_year: p.sw_until_year || null,
      ip_rating: parseIP(p.ip_rating),
      weight_g: parseWeight(p.weight),
      card_slot: parseCardSlot(p.card_slot),
      image_url: p.image_url || null,
    }
  })
  .filter(p =>
    p.price_inr && p.ram_gb && p.storage_gb && p.battery_mah &&
    p.display_size_inch && p.display_size_inch < 9.5
  )

console.log(`Prepared ${phones.length} phones from ${raw.length} total`)

console.log('\nSample parsed phones:')
phones.slice(0, 3).forEach(p => {
  console.log(`  ${p.name} | ₹${p.price_inr?.toLocaleString()} | ${p.ram_gb}GB RAM | ${p.storage_gb}GB storage | ${p.battery_mah}mAh | ${p.charging_w}W | ${p.display_hz}Hz | 5G:${p.has_5g}`)
  console.log(`    Reddit: ${p.reddit_sentiment} | ${p.reddit_praise}`)
  console.log(`    SW: ${p.sw_label} until ${p.sw_until_year} | IP: ${p.ip_rating} | ${p.weight_g}g | MicroSD: ${p.card_slot}`)
})

// --- step 1: delete all existing phones ---
console.log('\nDeleting existing phones from Supabase...')
await fetch(`${SUPABASE_URL}/rest/v1/phones?price_inr=gte.0`, { method: 'DELETE', headers: HEADERS })
await fetch(`${SUPABASE_URL}/rest/v1/phones?price_inr=is.null`, { method: 'DELETE', headers: HEADERS })
console.log('Deleted.')

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
    console.error(`\nBatch ${Math.floor(i / BATCH) + 1} FAILED:`, err)
    process.exit(1)
  }
  inserted += batch.length
  process.stdout.write(`\rInserted ${inserted}/${phones.length} phones...`)
}
console.log('\nDone!')
