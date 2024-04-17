<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLInputAttributes, HTMLTextareaAttributes } from 'svelte/elements'

  import Input from '$lib/ui/Input.svelte'
  import Field from './Field.svelte'

  let {
    name,
    id,
    placeholder,
    textarea = false,
    labelSlot,
    ...rest
  }: { name: string; id: string; textarea?: boolean; labelSlot?: Snippet } & HTMLInputAttributes &
    HTMLTextareaAttributes = $props()
</script>

<Field {name} for={id} label={labelSlot}>
  {#if textarea}
    <textarea
      {...rest}
      {id}
      class="input rounded border
 px-2.5
 py-1.5 outline-none focus-within:border-green
 hover:border-green
    "
      {placeholder}
      rows={8}
    />
  {:else}
    <Input {...rest} {id} {placeholder}></Input>
  {/if}
</Field>
