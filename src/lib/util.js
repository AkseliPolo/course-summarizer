export function dayKey(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function daysUntil(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((new Date(year, month - 1, day) - today) / 86_400_000)
}

export function shuffle(list) {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// 'Pääavain & co' -> 'paaavain-co'. Accents are dropped so that words in any language keep their letters.
export function slug(text) {
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function hash(text) {
  let value = 5381
  for (let i = 0; i < text.length; i++) value = ((value << 5) + value + text.charCodeAt(i)) >>> 0
  return value.toString(36)
}

// 125 -> "2:05"
export function clock(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

// 4500 -> "1 h 15 min"
export function duration(seconds) {
  const minutes = Math.floor(seconds / 60)
  return minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)} h ${minutes % 60} min`
}

export function cx(...names) {
  return names.filter(Boolean).join(' ')
}
