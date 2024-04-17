<script lang="ts">
  import { ONE_HOUR_IN_MS, getDateFormats, getTimeFormats } from 'san-webkit/lib/utils/dates'

  export let value: string

  function getTimeSince(value: string) {
    const diff = Date.now() - Date.parse(value)

    const hoursDiff = diff / ONE_HOUR_IN_MS

    const days = Math.floor(hoursDiff / 24)
    const hours = Math.floor(hoursDiff - days * 24)
    const minutes = Math.floor((hoursDiff - hours) * 60)

    let timeSince = ''

    if (days > 0) timeSince += `${days} day${days > 1 ? 's' : ''}`
    if (hours > 0) timeSince += ` ${hours} hour${hours > 1 ? 's' : ''}`

    timeSince = timeSince.trim()

    if (!timeSince) timeSince += `${minutes} minutes`

    return timeSince
  }

  function formatDate(value: string) {
    const date = new Date(value)
    const { MMM, DD, YYYY } = getDateFormats(date)
    const { HH, mm } = getTimeFormats(date)

    return `${MMM} ${DD}, ${YYYY} | ${HH}:${mm}`
  }
</script>

<time-since class="expl-tooltip" aria-label={formatDate(value)}>{getTimeSince(value)} </time-since>

<style>
  time-since {
    --expl-left: -12px;
  }
</style>
