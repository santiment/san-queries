<script context="module" lang="ts">
  import { dialogs } from 'san-webkit/lib/ui/Dialog'
  import Component from './index.svelte'

  export const showNameDescriptionDialog$ = () => dialogs.__WithCtx(Component)
</script>

<script lang="ts">
  import { track } from 'san-webkit/lib/analytics'
  import Dialog from 'san-webkit/lib/ui/Dialog'
  import Toggle from 'san-webkit/lib/ui/Toggle.svelte'
  import * as Field from '$lib/ui/Field'
  import Button from '$lib/ui/Button.svelte'
  import { useChangeIndicatorCtx } from '$lib/ChangeIndicator'
  import AIButton from './AIButton.svelte'
  import { useQueryEditorCtx } from '../ctx'

  let { DialogCtx, isAuthor = false, ...rest }: { DialogCtx: any; isAuthor?: boolean } = $props()

  const { queryEditor } = useQueryEditorCtx()
  const changeIndicatorCtx = useChangeIndicatorCtx()

  const sql = queryEditor.sql.$

  let name = $state(queryEditor.name.$)
  let description = $state(queryEditor.description.$)
  let isPublic = $state(queryEditor.isPublic.$)

  function onUpdateClick() {
    queryEditor.name.$ = name.trim()
    queryEditor.description.$ = description.trim()
    queryEditor.isPublic.$ = isPublic

    changeIndicatorCtx.emit.changed()

    DialogCtx.resolve({ name, description, isPublic })
    DialogCtx.close()
  }

  $effect(() => {
    track.event('query_title_description_dialog_open', {
      category: 'General',
      source_url: window.location.href,
    })

    return () => {
      track.event('query_title_description_dialog_close', {
        category: 'General',
        source_url: window.location.href,
      })
    }
  })
</script>

<Dialog {...rest} {DialogCtx} title="Update query" class="w-[480px]">
  <div class="dialog-body flex flex-col gap-4">
    <Field.Input
      id="query-name"
      name="Name"
      value={name}
      placeholder="Name of the query"
      oninput={({target}) => name = (target as HTMLInputElement).value}
    >
      {#snippet labelSlot()}
        <AIButton
          {sql}
          label="Name query using AI"
          onSuggestion={(data) => {
            name = data.title
          }}
        />
      {/snippet}
    </Field.Input>

    <Field.Input
      id="query-description"
      textarea
      name="Description"
      value={description}
      oninput={({target}) => description = (target as HTMLInputElement).value}
    >
      {#snippet labelSlot()}
        <AIButton
          {sql}
          label="Describe query using AI"
          onSuggestion={(data) => {
            description = data.description
          }}
        />
      {/snippet}
    </Field.Input>

    <actions class="mt-4 flex gap-4">
      <button class="btn-1" on:click={onUpdateClick} class:disabled={false}> Update </button>
      <Button variant="border" onclick={() => DialogCtx.close()}>Cancel</Button>

      {#if isAuthor && isPublic !== undefined}
        <button class="btn mrg-a mrg--l row v-center" on:click={() => (isPublic = !isPublic)}>
          {isPublic ? 'Public' : 'Private'}
          <Toggle isActive={isPublic} class="mrg-m mrg--l" />
        </button>
      {/if}
    </actions>
  </div>
</Dialog>
