import sharp from 'sharp'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const INPUT  = path.join(root, 'Assets', 'Process-Gravity-Logo.png')
const OUTPUT = path.join(root, 'Assets', 'Process-Gravity-Logo-transparent.png')

// Multi-target flood-fill: each candidate pixel is tested against a set of
// known background colours. A pixel is only removed if it is within TOLERANCE
// of at least one target AND its max channel value is at or below
// BRIGHTNESS_CAP — protecting all chrome, silver, blue and white logo pixels.
// Targets are calibrated from actual sampled background pixels in the source
// image — the logo's internal gradient is much darker than the page bg colour.
// Sampled range: rgb(1-3, 3-11, 10-26). Three anchor points cover it fully.
const TARGETS = [
  { r: 2, g: 4,  b: 13 },  // dark corners  (#020413)
  { r: 2, g: 8,  b: 20 },  // mid gradient  (#020814)
  { r: 3, g: 10, b: 26 },  // inner bg peak (#030a1a)
]
const TOLERANCE      = 8    // very tight — only near-exact matches
const BRIGHTNESS_CAP = 40   // any pixel with max(R,G,B) > 40 is never removed
const EDGE_FEATHER   = 0    // hard cut

async function main() {
  const { data, info } = await sharp(INPUT)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height } = info
  const ch = 4  // RGBA

  function idx(x, y)  { return (y * width + x) * ch }

  // Returns true if pixel at byte-offset i matches a target within tolerance
  // AND does not exceed the brightness cap on any channel.
  function isBackground(i) {
    const r = data[i], g = data[i+1], b = data[i+2]
    if (Math.max(r, g, b) > BRIGHTNESS_CAP) return false
    for (const t of TARGETS) {
      const dr = r - t.r, dg = g - t.g, db = b - t.b
      if (Math.sqrt(dr*dr + dg*dg + db*db) <= TOLERANCE) return true
    }
    return false
  }

  const marked = new Uint8Array(width * height)  // 1 = background

  // queue entries: [x, y] stored flat as 2 consecutive numbers
  const queue  = new Int32Array(width * height * 2)
  let qHead = 0
  let qTail = 0

  function enqueue(x, y) {
    const p = qTail * 2
    queue[p] = x; queue[p+1] = y
    qTail++
  }

  // Seed from all four edges — only enqueue edge pixels that are background
  for (let x = 0; x < width; x++) {
    for (const y of [0, height - 1]) {
      const i = idx(x, y)
      const pi = y * width + x
      if (!marked[pi] && isBackground(i)) {
        marked[pi] = 1
        enqueue(x, y)
      }
    }
  }
  for (let y = 1; y < height - 1; y++) {
    for (const x of [0, width - 1]) {
      const i = idx(x, y)
      const pi = y * width + x
      if (!marked[pi] && isBackground(i)) {
        marked[pi] = 1
        enqueue(x, y)
      }
    }
  }

  const dirs = [[-1,0],[1,0],[0,-1],[0,1]]

  while (qHead < qTail) {
    const p = qHead * 2
    const x = queue[p], y = queue[p+1]
    qHead++

    for (const [dx, dy] of dirs) {
      const nx = x + dx, ny = y + dy
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue
      const npi = ny * width + nx
      if (marked[npi]) continue

      const ni = idx(nx, ny)
      if (isBackground(ni)) {
        marked[npi] = 1
        enqueue(nx, ny)
      }
    }
  }

  // Apply transparency — hard cut
  for (let pi = 0; pi < width * height; pi++) {
    if (marked[pi]) data[pi * ch + 3] = 0
  }

  await sharp(Buffer.from(data), { raw: { width, height, channels: ch } })
    .png()
    .toFile(OUTPUT)

  console.log(`✓  Saved: ${OUTPUT}`)
  console.log(`   ${width}×${height}px  |  fill covered ${[...marked].filter(Boolean).length} pixels`)
}

main().catch(err => { console.error(err); process.exit(1) })
