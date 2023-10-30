<script lang="ts">
  import { getCurrentUser$Ctx } from 'webkit/stores/user'
  import Svg from 'webkit/ui/Svg/svelte'
  import Head from '../index.svelte'

  export let author: SAN.Author

  const { currentUser$ } = getCurrentUser$Ctx()

  $: currentUser = $currentUser$
  $: isAuthor = currentUser?.id === author.id
  $: mainActionLabel = isAuthor ? 'Publish' : 'Share'
</script>

<Head {author} {mainActionLabel}>
  1

  <svelte:fragment slot="actions">
    {#if isAuthor}
      <button class="btn-3"><Svg id="refresh" w="16" /></button>
      <button class="btn-3"><Svg id="share-dots" w="16" /></button>
      <button class="btn-3"><Svg id="vert-dots" w="3" h="16" /></button>
    {:else if currentUser}
      <button class="btn-3"><Svg id="copy" w="16" /></button>
    {/if}
  </svelte:fragment>
</Head>

<style></style>
