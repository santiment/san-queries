<script lang="ts">
  import Field from '$lib/ui/Field/Field.svelte'
  import Popover from '$lib/ui/Popover'
  import ColorPicker from '$lib/ui/ColorPicker'
  import { useObserveFnCall } from '$lib/ui/utils/state.svelte'
  import { debounceTime, pipe, tap } from 'rxjs'

  let {
    name,
    column,
    value = '',
    onChange,
  }: {
    name: string
    column: string
    value?: string
    onChange: (color: string) => void
  } = $props()

  let id = $derived(`${column}_${name}`)

  const onColorChange = useObserveFnCall<string>(() =>
    pipe(
      debounceTime(150),
      tap((color: string) => onChange(color)),
    ),
  )
</script>

<Field name="Color on chart" for={id}>
  <Popover>
    {#snippet children({ trigger, action, open })}
      <label use:action={trigger} class="flex cursor-pointer items-center gap-2" for={id}>
        <div class="color size-2.5 rounded-sm bg-[var(--color)]" style="--color:{value}"></div>
        {value}
      </label>
    {/snippet}

    {#snippet tooltip()}
      <ColorPicker color={value} onChange={onColorChange}></ColorPicker>
    {/snippet}
  </Popover>
</Field>
