// Builds Course Summarizer.exe: the web app, an icon, and the launcher in launcher/CourseSummarizer.cs, compiled
// into one file with the C# compiler that is part of Windows. Run with:  npm run exe

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { crc32, deflateSync } from 'node:zlib'
import { build } from 'vite'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const work = join(root, 'launcher', 'build')
const output = join(root, 'Course Summarizer.exe')

// ---- The icon: a dark rounded square with three gold lines, the last one cut short (a summary), ----
// ---- drawn here so no image file is needed ----

function drawIcon(size) {
  const pixels = Buffer.alloc(size * size * 4)
  const samples = 4
  const unit = size / 32 // the shape is designed on a 32 x 32 grid
  const radius = 7 * unit
  const stroke = 1.6 * unit // half the thickness of a line
  const lines = [
    [9, 10.5, 23, 10.5],
    [9, 16, 23, 16],
    [9, 21.5, 17.5, 21.5],
  ].map(line => line.map(value => value * unit))

  const insideSquare = (x, y) => {
    const dx = Math.max(radius - x, x - (size - radius), 0)
    const dy = Math.max(radius - y, y - (size - radius), 0)
    return dx * dx + dy * dy <= radius * radius
  }
  const nearLine = (x, y) =>
    lines.some(([x1, y1, x2, y2]) => {
      const lengthSquared = (x2 - x1) ** 2 + (y2 - y1) ** 2
      const t = Math.max(0, Math.min(1, ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) / lengthSquared))
      return Math.hypot(x - (x1 + t * (x2 - x1)), y - (y1 + t * (y2 - y1))) <= stroke
    })

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      let covered = 0
      let gold = 0
      for (let sy = 0; sy < samples; sy++) {
        for (let sx = 0; sx < samples; sx++) {
          const x = px + (sx + 0.5) / samples
          const y = py + (sy + 0.5) / samples
          if (!insideSquare(x, y)) continue
          covered++
          if (nearLine(x, y)) gold++
        }
      }
      if (covered === 0) continue
      const mix = gold / covered
      const at = (py * size + px) * 4
      pixels[at] = Math.round(17 + (237 - 17) * mix)
      pixels[at + 1] = Math.round(17 + (161 - 17) * mix)
      pixels[at + 2] = Math.round(16 + (0 - 16) * mix)
      pixels[at + 3] = Math.round((covered / (samples * samples)) * 255)
    }
  }
  return pixels
}

function pngChunk(type, data) {
  const body = Buffer.concat([Buffer.from(type), data])
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const check = Buffer.alloc(4)
  check.writeUInt32BE(crc32(body))
  return Buffer.concat([length, body, check])
}

function png(size, rgba) {
  const header = Buffer.alloc(13)
  header.writeUInt32BE(size, 0)
  header.writeUInt32BE(size, 4)
  header.set([8, 6, 0, 0, 0], 8) // 8 bits per channel, RGBA
  const rows = Buffer.alloc(size * (size * 4 + 1))
  for (let y = 0; y < size; y++) rgba.copy(rows, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4)
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', header),
    pngChunk('IDAT', deflateSync(rows)),
    pngChunk('IEND', Buffer.alloc(0)),
  ])
}

// The classic icon bitmap: BGRA rows from the bottom up, followed by an (empty) 1-bit mask.
function bitmap(size, rgba) {
  const header = Buffer.alloc(40)
  header.writeUInt32LE(40, 0)
  header.writeInt32LE(size, 4)
  header.writeInt32LE(size * 2, 8)
  header.writeUInt16LE(1, 12)
  header.writeUInt16LE(32, 14)
  const colour = Buffer.alloc(size * size * 4)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const from = ((size - 1 - y) * size + x) * 4
      const to = (y * size + x) * 4
      colour[to] = rgba[from + 2]
      colour[to + 1] = rgba[from + 1]
      colour[to + 2] = rgba[from]
      colour[to + 3] = rgba[from + 3]
    }
  }
  const mask = Buffer.alloc(Math.ceil(size / 32) * 4 * size)
  return Buffer.concat([header, colour, mask])
}

function icon() {
  const images = [16, 24, 32, 48, 64, 256].map(size => {
    const rgba = drawIcon(size)
    return { size, data: size === 256 ? png(size, rgba) : bitmap(size, rgba) }
  })
  const header = Buffer.alloc(6)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(images.length, 4)
  let offset = 6 + images.length * 16
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(16)
    entry[0] = size % 256 // 0 means 256
    entry[1] = size % 256
    entry.writeUInt16LE(1, 4)
    entry.writeUInt16LE(32, 6)
    entry.writeUInt32LE(data.length, 8)
    entry.writeUInt32LE(offset, 12)
    offset += data.length
    return entry
  })
  return Buffer.concat([header, ...entries, ...images.map(image => image.data)])
}

// ---- Build ----

function filesUnder(folder) {
  return readdirSync(folder).flatMap(name => {
    const path = join(folder, name)
    return statSync(path).isDirectory() ? filesUnder(path) : [path]
  })
}

const compiler = ['Framework64', 'Framework']
  .map(kind => join(process.env.WINDIR ?? 'C:\\Windows', 'Microsoft.NET', kind, 'v4.0.30319', 'csc.exe'))
  .find(existsSync)
if (!compiler) {
  console.error('The C# compiler (csc.exe) that normally comes with Windows was not found.')
  process.exit(1)
}

console.log('1/3  Building the web app')
await build({ root, logLevel: 'warn' })

console.log('2/3  Drawing the icon')
mkdirSync(work, { recursive: true })
const iconFile = join(work, 'course-summarizer.ico')
writeFileSync(iconFile, icon())

console.log('3/3  Compiling Course Summarizer.exe')
// Every file of the web app is embedded under the name the launcher serves it by: web/<path>.
const resources = filesUnder(dist).map(file => `/resource:"${file}","web/${relative(dist, file).replaceAll('\\', '/')}"`)
const responseFile = join(work, 'build.rsp')
writeFileSync(
  responseFile,
  ['/nologo', '/target:winexe', '/optimize+', '/platform:anycpu', `/win32icon:"${iconFile}"`, `/out:"${output}"`, ...resources, `"${join(root, 'launcher', 'CourseSummarizer.cs')}"`].join('\n'),
)

try {
  execFileSync(compiler, [`@${responseFile}`], { stdio: 'inherit' })
} catch {
  console.error('\nCompiling failed, see the messages above. If they say the .exe cannot be written, close the Course Summarizer window and try again: Windows locks a running .exe.')
  process.exit(1)
}

console.log(`\nDone: ${output} (${Math.round(statSync(output).size / 1024)} KB, ${resources.length} files inside)`)
