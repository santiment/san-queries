<script lang="ts">
  import { showParameterDialog$ } from '$lib/ParameterDialog/index.svelte'
  import Parameter, { COLORS } from '$lib/ui/Parameter'
  import { useQueryEditorCtx } from './ctx'

  let { isAuthor = false, onChange }: { isAuthor: boolean; onChange: () => void } = $props()

  const { queryEditor } = useQueryEditorCtx()
  const showParameterDialog = showParameterDialog$()

  function onEditClick(parameter) {
    showParameterDialog({ parameter, strict: true }).then((changed) => {
      Object.assign(parameter, changed)

      queryEditor.parameters.$ = queryEditor.parameters.$

      onChange()
    })
  }

  function onRemoveClick(parameter) {
    if (confirm('Remove this parameter? This action cannot be undone')) {
      queryEditor.parameters.$ = queryEditor.parameters.$.filter((item) => item !== parameter)

      onChange()
    }
  }
</script>

<parameters class="flex flex-wrap gap-2">
  {#each queryEditor.parameters.$ as parameter, i}
    <Parameter
      color={COLORS[i]}
      {parameter}
      {isAuthor}
      onEditClick={() => onEditClick(parameter)}
      onRemoveClick={() => onRemoveClick(parameter)}
    ></Parameter>
  {/each}
</parameters>
