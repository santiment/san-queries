<script lang="ts">
  import Input from '$lib/ui/Input.svelte'
  import Button from 'san-webkit-next/ui/core/Button'
  import Popover from 'san-webkit-next/ui/core/Popover'

  import type { ComponentProps } from 'svelte'
  import { getEditorCtx } from 'tiptap-svelte-adapter'

  let { children }: { children: ComponentProps<Popover>['children'] } = $props()

  const editor = getEditorCtx()

  function onFormSubmit(e: Event, close: () => void) {
    e.preventDefault()

    const node = (e.currentTarget as HTMLFormElement).link as HTMLInputElement
    const value = node.value.trim()

    if (!value) {
      return onFormReset(e, close)
    }

    const url = getValidUrl(node.value)
    if (!url) return

    // console.log(url, )
    editor.chain().setLink({ href: url.toString() }).run()
    close()
  }

  function onFormReset(e: Event, close: () => void) {
    e.preventDefault()
    editor.chain().unsetLink().run()
    close()
  }

  function getValidUrl(input: string): null | URL {
    const value = input.trim()

    if (!value || value.includes('.') === false) return null
    const [fallback, url = fallback] = value.split('://')

    try {
      return new URL(`https://${url}`)
    } catch (e) {
      return null
    }
  }
</script>

<Popover {children} class="z-[10000] p-1">
  {#snippet content({ close })}
    {@const href = editor.getAttributes('link').href || ''}
    <form
      class="flex"
      onsubmit={(e) => onFormSubmit(e, close)}
      onreset={(e) => onFormReset(e, close)}
    >
      <Input
        name="link"
        placeholder="Paste a link"
        class="border-none"
        value={editor.getAttributes('link').href || ''}
      ></Input>

      {#if href}
        <Button
          variant="fill"
          icon="delete"
          class="bg-red-light-1-day fill-red hover:bg-red-light-2"
          type="reset"
        ></Button>
      {:else}
        <Button variant="fill" class="px-2 py-1 text-xs" type="submit">Add</Button>
      {/if}
    </form>
  {/snippet}
</Popover>
