<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import Component from './index.svelte'

  export const showNameDescriptionDialog = (props: any) =>
    dialogs.__show(Component, { ...props, strict: true })
</script>

<script lang="ts">
  import { BROWSER } from 'esm-env'
  import { onDestroy } from 'svelte'
  import { track } from 'webkit/analytics'
  import Dialog from 'webkit/ui/Dialog'
  import Toggle from 'webkit/ui/Toggle.svelte'
  import Control from '$lib/QueryEditor/Visualisation/Control.svelte'
  import AIButton from './AIButton.svelte'

  export let queryEditor: App.QueryEditorStoreValue
  export let DialogCtx: SAN.Dialog.Ctx
  export let isAuthor = true

  const query = queryEditor.query as App.ApiQuery

  const { sql } = queryEditor
  let { name, description } = queryEditor
  let { isPublic } = query || {}

  function onUpdateClick() {
    DialogCtx.resolve({ name, description, isPublic })
    DialogCtx.close()
  }

  track.event('query_title_description_dialog_open', {
    category: 'General',

    source_url: window.location.href,
  })

  onDestroy(() => {
    if (BROWSER) {
      track.event('query_title_description_dialog_close', {
        category: 'General',

        source_url: window.location.href,
      })
    }
  })
</script>

<Dialog {...$$props} title="Update query">
  <div class="dialog-body column gap-l">
    <Control
      name="Name"
      value={name}
      placeholder="Name of the query"
      onUpdate={(value) => (name = value)}
    >
      <AIButton
        slot="label"
        {sql}
        label="Name query using AI"
        onSuggestion={(data) => {
          name = data.title
        }}
      />
    </Control>

    <Control
      textarea
      name="Description"
      value={description}
      onUpdate={(value) => (description = value)}
    >
      <AIButton
        slot="label"
        {sql}
        label="Describe query using AI"
        onSuggestion={(data) => {
          description = data.description
        }}
      />
    </Control>

    <actions class="row gap-l mrg-l mrg--t">
      <button class="btn-1" on:click={onUpdateClick} class:disabled={false}> Update </button>
      <button class="btn-2" on:click={() => DialogCtx.close()}>Cancel</button>

      {#if isAuthor && isPublic !== undefined}
        <button class="btn mrg-a mrg--l row v-center" on:click={() => (isPublic = !isPublic)}>
          {isPublic ? 'Public' : 'Private'}
          <Toggle isActive={isPublic} class="mrg-m mrg--l" />
        </button>
      {/if}
    </actions>
  </div>
</Dialog>

<style lang="scss">
  Dialog {
    width: 480px;
  }
</style>
