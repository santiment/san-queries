<script lang="ts">
  import { useChangeIndicatorCtx } from '$lib/ChangeIndicator'
  import ContentEditable from '$lib/ContentEditable.svelte'
  import { useDashboardEditorCtx } from './ctx/index'
  import { useSaveEmptyFlowCtx } from './flow/save'

  const changeIndicatorCtx = useChangeIndicatorCtx()
  const { saveEmptyDashboard } = useSaveEmptyFlowCtx()
  const { dashboardEditor } = useDashboardEditorCtx()

  const { id, name, description, readonly } = dashboardEditor

  function onTitleBlur(name: string) {
    if (id) {
      dashboardEditor.name.$ = name
      return changeIndicatorCtx.emit.changed()
    }

    saveEmptyDashboard({ name })
  }

  function onDescriptionBlur(description: string) {
    if (id) {
      dashboardEditor.description.$ = description
      return changeIndicatorCtx.emit.changed()
    }

    saveEmptyDashboard({ description })
  }
</script>

<section class="flex flex-col gap-1">
  <ContentEditable
    tag="h1"
    class="text-2xl font-medium"
    value={name.$}
    {readonly}
    placeholder="Add your title here..."
    onBlur={onTitleBlur}
  />

  {#if readonly ? description : true}
    <ContentEditable
      tag="p"
      class="text-base"
      value={description.$}
      {readonly}
      placeholder="Add description here..."
      onBlur={onDescriptionBlur}
    />
  {/if}
</section>
