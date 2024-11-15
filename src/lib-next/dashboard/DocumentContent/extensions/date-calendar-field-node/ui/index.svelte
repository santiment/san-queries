<script lang="ts">
  import type { DATE_CALENDAR_FIELD_NODE } from '../schema'
  import type { TParameterWidgetProps } from '../../schema/parameter-widget'

  import { getFormattedMonthDayYear } from 'san-webkit-next/utils/dates'
  import Calendar from 'san-webkit-next/ui/core/Calendar'
  import { useParameterWidgetFlow } from '$lib-next/dashboard/ctx/parameter-widgets.svelte'
  import NodeSettings from '../../NodeSettings.svelte'
  import { showLinkParameterDialog$ } from '../../LinkParameterDialog.svelte'
  import { normalizeDate, tryDate } from '../utils'

  let { view, data }: TParameterWidgetProps<typeof DATE_CALENDAR_FIELD_NODE> = $props()

  const { globalParameter, update } = useParameterWidgetFlow(view, data.widget)
  const { outputs } = globalParameter

  const date = $derived(tryDate(outputs.$$.value))

  const showLinkParameterDialog = showLinkParameterDialog$()

  function onSettingsClick() {
    showLinkParameterDialog({ globalParameter })
  }

  function onChange(date: Date) {
    update('value', normalizeDate(date).toISOString())
  }
</script>

<Calendar timeZone="utc" class="px-2" {date} {onChange}>
  {getFormattedMonthDayYear(date, { utc: true })}
</Calendar>

<NodeSettings onclick={onSettingsClick}></NodeSettings>
