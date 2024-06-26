<script lang="ts">
  import Svg from 'san-webkit-next/ui/core/Svg'
  import Input from 'san-webkit-next/ui/core/Input'
  import { NodeViewWrapper, type ViewProps } from 'tiptap-svelte-adapter'

  import { useDashboardEditorCtx } from '$lib/DashboardNext/ctx'
  import { useParametersWidgetFlow } from '../parameters.svelte'
  import { showLinkParameterDialog$ } from '../AssetSelector/LinkParameterDialog.svelte'

  let { view }: ViewProps = $props()

  const { dashboardEditor } = useDashboardEditorCtx()

  const state = useParametersWidgetFlow(view, { keyPrefix: 'InputField', defaultValue: '' })

  // TODO: Create generic global-parameter settings component
  const showLinkParameterDialog = showLinkParameterDialog$()

  function onFormSubmit(e: Event) {
    e.preventDefault()

    const formNode = e.currentTarget as null | HTMLFormElement
    if (!formNode) return

    const inputNode = formNode.parameter as null | HTMLInputElement
    if (!inputNode) return

    const value = inputNode.value.trim()
    state.update(value)
  }

  function onLinkParameterClick() {
    const parameter = state.parameter
    if (!parameter) return

    showLinkParameterDialog({ parameter }).then((changed) => {
      Object.assign(parameter, changed)

      dashboardEditor.parameters.$ = dashboardEditor.parameters.$
    })
  }
</script>

<NodeViewWrapper class="ml-0.5 inline-flex text-sm center">
  <form onsubmit={onFormSubmit} onblurcapture={onFormSubmit}>
    <Input
      name="parameter"
      icon="editor/subtitle"
      iconSize={12}
      placeholder="Parameter value"
      value={state.$}
    ></Input>
  </form>

  {#if dashboardEditor.readonly === false}
    <button
      class="ml-2 cursor-pointer fill-waterloo hover:fill-green"
      onclick={onLinkParameterClick}
    >
      <Svg id="cog" w="12"></Svg>
    </button>
  {/if}
</NodeViewWrapper>
