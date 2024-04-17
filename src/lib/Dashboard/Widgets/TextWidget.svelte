<script lang="ts">
  import { ss } from 'svelte-runes'
  import { debounceTime, filter, map, of, pipe, switchMap, tap } from 'rxjs'
  import Editor from 'san-webkit/lib/ui/Editor'
  import { markdownToHTML } from 'san-webkit/lib/ui/Editor/markdown'
  import Button from '$lib/ui/Button.svelte'
  import { useObserveFnCall } from '$lib/ui/utils/state.svelte'
  import { useDeleteDashboardTextWidgetFlow, useUpdateDashboardTextWidget } from '../flow/widgets'
  import { useDashboardEditorCtx } from '../ctx'

  let {
    readonly = true,
    widget,
  }: {
    readonly?: boolean
    widget: App.Dashboard.TextWidget
  } = $props()

  const { dashboardEditor } = useDashboardEditorCtx()
  const { deleteDashboardTextWidget } = useDeleteDashboardTextWidgetFlow()
  const { updateDashboardTextWidget } = useUpdateDashboardTextWidget()

  let editor = ss<any>()

  function onDeleteClick() {
    const dashboardId = dashboardEditor.id
    if (!dashboardId) return

    deleteDashboardTextWidget({ dashboardId, widget })
  }

  const onInput = useObserveFnCall(() =>
    pipe(
      debounceTime(1000),
      switchMap(() =>
        of(null).pipe(
          filter(() => !!editor.$ && !!dashboardEditor.id),
          map(() => editor.$!.serialize()),
          tap((value) =>
            updateDashboardTextWidget({
              textWidgetId: widget.id,
              dashboardId: dashboardEditor.id,
              value: value || '',
            }),
          ),
          tap((value) => (widget.value = value)),
        ),
      ),
    ),
  )
</script>

<section class="relative flex rounded bg-athens text-base" oninput={readonly ? undefined : onInput}>
  {#if readonly}
    {@const html = markdownToHTML(widget.value || '')}
    <div class="text">{@html html}</div>
  {:else}
    <Editor
      bind:editor={editor.$}
      placeholder="Add your text here..."
      html={widget.value ? markdownToHTML(widget.value) : undefined}
    />

    <Button icon="close" iconSize="12" class="absolute right-4 top-2.5" onclick={onDeleteClick}
    ></Button>
  {/if}
</section>

<style lang="postcss">
  Editor,
  .text {
    padding: 16px 48px 16px 24px;
    overflow: auto;
  }
</style>
