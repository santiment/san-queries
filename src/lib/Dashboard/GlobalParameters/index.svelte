<script lang="ts">
  import Parameter from '$lib/ui/Parameter'
  import { useDeleteGlobalParameterFlow } from './flow'
  import { useDashboardEditorCtx } from '../ctx/index'
  import { showGlobalParameterDialog$ } from './ParameterDialog.svelte'

  let { isAuthor = false }: { isAuthor?: boolean } = $props()

  const showGlobalParameterDialog = showGlobalParameterDialog$()
  const { dashboardEditor } = useDashboardEditorCtx()
  const { deleteGlobalParameter } = useDeleteGlobalParameterFlow()

  function onLinkClick(parameter: (typeof dashboardEditor)['parameters']['$'][number]) {
    if (!dashboardEditor.id) return

    showGlobalParameterDialog({ parameter, strict: true }).then((changed) => {
      Object.assign(parameter, changed)

      dashboardEditor.parameters.$ = dashboardEditor.parameters.$
    })
  }

  function onRemoveClick(parameter: (typeof dashboardEditor)['parameters']['$'][number]) {
    if (!dashboardEditor.id) return

    if (confirm('Remove this parameter? This action cannot be undone')) {
      deleteGlobalParameter({ dashboard: dashboardEditor as { id: number }, parameter })

      dashboardEditor.parameters.$ = dashboardEditor.parameters.$.filter(
        (item) => item !== parameter,
      )
    }
  }
</script>

<section class="flex flex-wrap gap-2">
  {#each dashboardEditor.parameters.$ as parameter (parameter.key)}
    <Parameter
      global
      {parameter}
      {isAuthor}
      onLinkClick={() => onLinkClick(parameter)}
      onRemoveClick={() => onRemoveClick(parameter)}
    ></Parameter>
  {/each}
</section>
