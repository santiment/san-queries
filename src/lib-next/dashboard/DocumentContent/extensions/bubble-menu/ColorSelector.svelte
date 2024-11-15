<script lang="ts">
  import type { ComponentProps } from 'svelte'

  import { getEditorCtx } from 'tiptap-svelte-adapter'
  import Popover from 'san-webkit-next/ui/core/Popover'
  import { HIGHLIGHT_COLORS, TEXT_COLORS } from './colors'

  let { children }: { children: ComponentProps<Popover>['children'] } = $props()

  const editor = getEditorCtx()
</script>

<Popover {children} class="z-[10000] max-h-[500px] min-w-[170px] overflow-auto column">
  {#snippet content()}
    <p class="mb-1 text-xs font-bold text-waterloo">Color</p>
    {#each TEXT_COLORS as { name, color }}
      <button
        class="justify-start gap-2 px-1.5 py-0.5"
        onclick={() => {
          editor.commands.unsetColor()
          if (name !== 'Default') editor.commands.setColor(color || '')
        }}
      >
        <span class="size-5" style:color>A</span>
        {name}
      </button>
    {/each}

    <p class="mb-1 mt-2 text-xs font-bold text-waterloo">Background</p>
    {#each HIGHLIGHT_COLORS as { name, color }}
      <button
        class="justify-start gap-2 px-1.5 py-0.5"
        onclick={() => {
          editor.commands.unsetHighlight()
          if (name !== 'Default') editor.commands.setHighlight({ color })
        }}
      >
        <span class="size-5 rounded" style:background={color}>A</span>
        {name}
      </button>
    {/each}
  {/snippet}
</Popover>

<style>
  button {
    @apply inline-flex rounded-md hover:bg-athens;
  }

  :global {
    :root {
      --highlight-purple: var(--purple);
      --highlight-red: var(--red);
      --highlight-blue: var(--blue);
      --highlight-yellow: var(--yellow);
      --highlight-orange: var(--orange);
      --highlight-green: var(--green);
      --highlight-gray: var(--waterloo);
    }
  }
</style>
