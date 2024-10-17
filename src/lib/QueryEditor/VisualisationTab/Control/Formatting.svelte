<script lang="ts">
  import { useQuerySettingsCtx } from '$lib/QueryEditor/ctx'
  import { FormatType, Formatter } from '$lib/Visualization/format'
  import * as Field from '$lib/ui/Field'

  let { column, type, value }: { column: string; type: string; value?: number } = $props()

  const querySettingsCtx = useQuerySettingsCtx()

  function getFormatters(type: string): Readonly<(typeof Formatter)[keyof typeof Formatter]>[] {
    if (type.includes('Date')) {
      return [Formatter[FormatType.DATE], Formatter[FormatType.TIME_SINCE]]
    }

    if (type.includes('Int') || type.includes('Float')) {
      return [
        Formatter[FormatType.MILLLIFY],
        Formatter[FormatType.USD],
        Formatter[FormatType.PERCENT_CHANGE],
      ]
    }

    return [
      Formatter[FormatType.LABELS],
      Formatter[FormatType.ASSET],
      Formatter[FormatType.ADDRESS],
    ]
  }
</script>

<Field.Select
  name="Format"
  value={value === undefined ? undefined : Formatter[value as keyof typeof Formatter]}
  defaultValue="No formatting"
  options={getFormatters(type)}
  onChange={(value) => {
    querySettingsCtx.applyColumnSettings(column, { formatter: value ? +value.key : undefined })
  }}
>
  {#snippet children({ option })}
    {option.title}
  {/snippet}
</Field.Select>
