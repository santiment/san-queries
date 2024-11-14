<script lang="ts">
  import type { TEXT_INPUT_FIELD_NODE } from '../schema'
  import type { TGlobalParametersWidgetProps } from '../../schema/global-parameter'

  import Input from 'san-webkit-next/ui/core/Input'
  import { useParameterWidgetFlow } from '$lib-next/features/Dashboard/ctx/parameter-widgets.svelte'
  import NodeSettings from '../../NodeSettings.svelte'
  import { showLinkParameterDialog$ } from '../../LinkParameterDialog.svelte'

  let { view, data }: TGlobalParametersWidgetProps<typeof TEXT_INPUT_FIELD_NODE> = $props()

  const { globalParameter, update } = useParameterWidgetFlow(view, data.widget)
  const { outputs } = globalParameter

  const showLinkParameterDialog = showLinkParameterDialog$()

  function onSettingsClick() {
    showLinkParameterDialog({ globalParameter })
  }

  function onFormSubmit(e: Event) {
    const formNode = e.currentTarget as null | HTMLFormElement
    if (!formNode) return

    const inputNode = formNode.parameter as null | HTMLInputElement
    if (!inputNode) return

    const value = inputNode.value.trim()
    update('value', value)
  }
</script>

<form class="ml-0.5" onsubmit={onFormSubmit} onblurcapture={onFormSubmit}>
  <Input
    name="parameter"
    icon="editor/subtitle"
    iconSize={12}
    placeholder="Parameter value"
    value={outputs.$$.value}
  ></Input>
</form>

<NodeSettings onclick={onSettingsClick}></NodeSettings>
