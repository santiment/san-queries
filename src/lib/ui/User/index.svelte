<script lang="ts">
  import { createAvatar, melt } from '@melt-ui/svelte'

  import { cn } from '$lib/ui/utils'
  import Svg from '../Svg.svelte'

  let {
    user,
    class: className = '',
  }: {
    user: App.Author
    class?: string
  } = $props()

  const {
    elements: { image, fallback },
  } = createAvatar({ src: user.avatarUrl ?? '' })
</script>

<a
  href="https://app.santiment.net/profile/{user.id}"
  target="_blank"
  class={cn('group flex items-center gap-2', className)}
>
  <div
    class="flex h-6 w-6 items-center justify-center rounded-full bg-athens group-hover:shadow-[0_0_0_1px_var(--green)]"
  >
    <img use:melt={$image} alt="Avatar" class="h-full w-full rounded-[inherit]" />

    <span use:melt={$fallback} class="fill-waterloo text-xs font-medium uppercase text-waterloo">
      {#if user.username}
        {user.username.slice(0, 1)}
      {:else}
        <Svg id="user" w="14" />
      {/if}
    </span>
  </div>

  <span class="group-hover:text-green">
    {user.username ? '@' + user.username : '<hidden>'}
  </span>
</a>
