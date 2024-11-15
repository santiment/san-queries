export function tryDate(isoDate: string) {
  let date = new Date(isoDate)

  if (Number.isNaN(+date)) {
    date = normalizeDate(new Date())
  }

  return date
}

export function normalizeDate(date = new Date()) {
  date.setUTCHours(23, 59, 59, 0)
  return date
}
