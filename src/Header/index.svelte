<script>
  import Svg from 'webkit/ui/Svg/svelte'
  import CreationInfo from './CreationInfo.svelte'
  import Comments from './Comments.svelte'
  import { showShareDialog } from '@/ShareDialog.svelte'

  let isCommentsShowed = false
</script>

<div class="row v-center mrg-xl mrg--b">
  <CreationInfo onCommentsClick={() => (isCommentsShowed = !isCommentsShowed)} />

  <Comments bind:isCommentsShowed />

  <button class="btn mrg-a mrg--l row v-center">
    <Svg id="copy" w="16" class="mrg-s mrg--r" />
    Duplicate</button>
  <button class="btn mrg-xl mrg--l row v-center" on:click={() => showShareDialog()}>
    <Svg id="share-dots" w="14" h="16" class="mrg-s mrg--r" />
    Share</button>
</div>

<style>
  button {
    --fill: var(--waterloo);
    --color-hover: var(--green);
  }
</style>
