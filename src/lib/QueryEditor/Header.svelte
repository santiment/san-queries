<script lang="ts">
  import { showShareDialog } from 'san-webkit/lib/ui/Share/index.svelte'
  import { page as page$ } from '$app/stores'
  import Button from '$lib/ui/Button.svelte'
  import Popover from '$lib/ui/Popover'
  import User from '$lib/ui/User/index.svelte'
  import { cn } from '$lib/ui/utils'
  import AiSuggest from './AiSuggest.svelte'
  import ExecuteButton from './ExecuteButton.svelte'
  import ExecutionTime from './ExecutionTime.svelte'
  import { showNameDescriptionDialog$ } from './NameDescriptionDialog/index.svelte'
  import { useQueryEditorCtx } from './ctx'
  import { showAddToDashboardDialog$ } from './AddToDashboardDialog/index.svelte'

  let {
    author,
    isAuthor = false,
    currentUser,
    stats,
    onSaveClick,
    onDuplicateClick,
    onExecuteClick,
    onDeleteClick,
  }: {
    author: App.Author
    isAuthor: boolean
    currentUser: null | {}
    stats?: {}
    onSaveClick: () => void
    onDuplicateClick: () => void
    onExecuteClick: () => void
    onDeleteClick: () => void
  } = $props()

  const { queryEditor } = useQueryEditorCtx()
  const showNameDescriptionDialog = showNameDescriptionDialog$()
  const showAddToDashboardDialog = showAddToDashboardDialog$()

  function onAddToDashboardClick() {
    if (queryEditor.id) {
      showAddToDashboardDialog({ queryId: queryEditor.id })
    }
  }

  function onShareClick() {
    showShareDialog({ entity: 'Query', feature: 'query', source: 'query_head' })
  }
</script>

<header class="flex items-center">
  <User user={author} class="text-waterloo" />

  <div class="ml-3 flex h-[32px] gap-1 border-l fill-fiord pl-3 text-base text-rhino">
    {#if isAuthor && queryEditor.name.$.includes(', 2024, ')}
      <AiSuggest></AiSuggest>
    {/if}

    <Button
      variant="ghost"
      class={cn('px-2', !isAuthor && 'pointer-events-none')}
      onclick={() => showNameDescriptionDialog({ isAuthor })}
    >
      {queryEditor.name.$ || 'Untitled query'}
    </Button>
  </div>

  <div class="ml-auto mr-4 flex items-center">
    {#if isAuthor || currentUser}
      {#if stats}
        <ExecutionTime {stats}></ExecutionTime>
      {/if}

      <ExecuteButton onclick={onExecuteClick}></ExecuteButton>

      <Button
        variant="border"
        icon="plus"
        iconSize="10"
        class="ml-4 bg-athens fill-waterloo hover:text-green"
        onclick={onAddToDashboardClick}
      >
        To dashboard
      </Button>
    {:else}
      <Button variant="fill" href="/sign-up?from={encodeURIComponent($page$.url.pathname)}">
        Log in to duplicate
      </Button>
    {/if}
  </div>

  <div class="flex gap-2">
    {#if isAuthor}
      <Button icon="save" explanation="Save" onclick={onSaveClick} />
      <Button icon="copy" explanation="Duplicate" onclick={onDuplicateClick} />
      <Button icon="share-dots" explanation="Share" onclick={onShareClick} />

      <Popover placement="bottom-end">
        {#snippet children({ action, trigger })}
          <Button icon="vert-dots" {action} actionArgs={trigger} />
        {/snippet}

        {#snippet tooltip({ close })}
          <Button variant="ghost" action={close} onclick={onDeleteClick}>Delete</Button>
        {/snippet}
      </Popover>
    {:else if currentUser}
      <Button icon="copy" explanation="Duplicate" onclick={onDuplicateClick} />
      <Button icon="share-dots" explanation="Share" onclick={onShareClick} />
    {:else}
      <Button icon="share-dots" explanation="Share" />
    {/if}
  </div>
</header>
