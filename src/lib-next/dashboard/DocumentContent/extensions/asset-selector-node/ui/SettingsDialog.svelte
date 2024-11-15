<script module lang="ts">
  import Component from './SettingsDialog.svelte'

  export const showSettingsDialog$ = () => dialogs$.new(Component)
</script>

<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import type { TParameterWidgetProps } from '../../schema/parameter-widget'
  import type { ASSET_SELECTOR_NODE } from '../schema'

  import { dialogs$ } from 'san-webkit-next/ui/core/Dialog'
  import LinkParameterDialog from '../../LinkParameterDialog.svelte'

  let props: ComponentProps<typeof LinkParameterDialog> = $props()

  const globalParameter = props.globalParameter as TParameterWidgetProps<
    typeof ASSET_SELECTOR_NODE
  >['data']['widget']

  const { settings } = globalParameter

  function onBlur(e: Event & { currentTarget: HTMLTextAreaElement }) {
    const value = e.currentTarget.value.trim()

    const slugs = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    if (slugs.length) {
      settings.$$.slugsByText = slugs
    } else {
      settings.$$.slugsByText = undefined
    }
  }
</script>

<LinkParameterDialog {...props}>
  <div class="p-3 column">
    <h2 class="text-base font-medium">Manual list of slugs</h2>
    <textarea
      name="slugs"
      class="flex-1 rounded border px-1.5 py-2 outline-none focus:border-green"
      rows="3"
      value={settings.$$.slugsByText?.join(', ') || ''}
      onblur={onBlur}
    ></textarea>
  </div>
</LinkParameterDialog>
