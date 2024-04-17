import { getDateFormats, getTimeFormats } from 'san-webkit/lib/utils/dates'

export function getPlaceholderName() {
  const now = new Date()
  const { DD, MMM, YYYY } = getDateFormats(now)
  const { HH, mm } = getTimeFormats(now)

  return `${MMM} ${DD}, ${YYYY}, ${HH}:${mm}`
}
