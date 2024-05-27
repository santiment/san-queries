<script context="module" lang="ts">
  import { dialogs } from 'san-webkit/lib/ui/Dialog'
  import Component from './index.svelte'

  export const showDashboardPublishedDialog$ = () => dialogs.__WithCtx(Component)
</script>

<script lang="ts">
  import Dialog from 'san-webkit/lib/ui/Dialog'
  import { showShareDialog } from 'san-webkit/lib/ui/Share/index.svelte'
  import { copy } from 'san-webkit/lib/utils'
  import Svg from '$lib/ui/Svg.svelte'

  let copyLabel = 'Copy link'
  function onCopy() {
    copyLabel = 'Copied!'
    copy(window.location.href, () => (copyLabel = 'Copy link'), 1000)
  }

  function onShare() {
    showShareDialog({ entity: 'Dashboard', feature: '', source: '' })
  }
</script>

<Dialog {...$$props} noTitle class="column v-center" let:closeDialog>
  <svg class="mrg-l mrg--b" width="77" height="69" fill="none" xmlns="http://www.w3.org/2000/svg"
    ><path
      d="M72 32.9C71 43 60 55 48.6 59a47 47 0 0 1-41.5-1.7c-3.5-2-6.9-7-7-12.8C-.7 27.7 27.3 3 44 3c12.7 0 29 17.6 28 29.9Z"
      fill="#181B2B"
    /><path
      d="M59.7 26.4c1.1-4-2.7-7.4-6.5-5.6L67.3 3l7.5 1.4c1.1.2 1.6 1.5.9 2.4l-16 19.6Z"
      fill="#14C393"
    /><path
      d="M17 43.3 13.4 20l-6.6-1.3c-1-.2-2 .8-1.8 1.8l8.5 44.8a1.5 1.5 0 0 0 2.6.7L66.2 2.8l-9-1.8c-.5 0-1.1.1-1.5.6L39.4 22l-18 22.4a2.5 2.5 0 0 1-4.4-1.2Z"
      fill="#8AFFCE"
    /><path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M55 1c.5-.8 1.5-1.1 2.4-1L75 3.4c1.8.4 2.6 2.6 1.4 4L27.1 68.1a3 3 0 0 1-2.5.9l-6.5-1.3-2.2-.4c-1.4.5-3.1-.2-3.4-1.9L4 20.6a2.5 2.5 0 0 1 3-3l6.9 1.4 7.7 1.4c1 .2 1.8 1 2 2L26.2 37 55 1ZM13.3 19.9 17 43.3c.3 2.2 3 2.9 4.5 1.2l4.8-6 29.4-37c.4-.4 1-.6 1.5-.5l9 1.8-50 63.1-.6.4c-.9.4-2 0-2.1-1L5 20.3c-.2-1 .8-2 1.8-1.8l6.6 1.3Zm39.8 1c3.8-1.9 7.6 1.5 6.5 5.5l16-19.6c.7-.9.2-2.2-1-2.4L67.4 3 53.2 20.8Z"
      fill="#181B2B"
    /><path
      d="M16.6 19a.5.5 0 0 0-.2 1l4.8.8c1 .2 1.7.9 1.8 1.7l2 12a.5.5 0 0 0 1 0l-2-12.2c-.2-1.3-1.3-2.2-2.6-2.4l-4.8-.9Zm42.3 10.8c.2-.2.1-.5 0-.7a.5.5 0 0 0-.8 0L26.6 67.3a2 2 0 0 1-2 .8l-7-1.4c-.3 0-.5.2-.6.4 0 .3.1.6.4.6l7 1.3a3 3 0 0 0 3-1l31.5-38Z"
      fill="#FFCB47"
    /></svg
  >

  <button class="close" onclick={() => closeDialog()}>
    <Svg id="close" w="12" />
  </button>

  <h2 class="h4 txt-m mrg-s mrg--b">Your dashboard is published!</h2>
  <p class="c-waterloo mrg-xl mrg--b">Now everyone can see it in “Explorer” page</p>

  <actions class="flex gap-4">
    <button class="btn-1 btn--s" onclick={onCopy}>
      <Svg id="link" w="16" />
      {copyLabel}
    </button>

    <button class="btn-2 btn--s !h-8 !px-2" onclick={onShare}>
      <Svg id="share-dots" w="14" h="16" />
      Share
    </button>
  </actions>
</Dialog>

<style lang="scss">
  Dialog {
    padding: 16px 40px 36px 40px;
  }

  button {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .close {
    position: absolute;
    top: 22px;
    right: 22px;
  }
</style>
