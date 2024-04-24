<script>
  import Svg from 'san-webkit/lib/ui/Svg/svelte'
  import { getDialogCtx } from 'san-webkit/lib/ui/Dialog'

  let className = ''
  export { className as class }
  export let title =
    'Duration restriction! Your Alert will be valid for 30 days. To extend Alert please'

  const DialogCtx = getDialogCtx()

  let show = true

  function onLinkClick() {
    if (DialogCtx) DialogCtx.close()
  }
</script>

{#if show}
  <section class="fluid row v-center {className}">
    <Svg id="warning" w="16" h="14" class="$style.warning mrg-m mrg--r" />
    {title}
    <a href="/pricing" class="btn-0 btn--orange mrg-xs mrg--l" on:click={onLinkClick}>
      Update your Plan!
    </a>
    <button class="btn mrg-a mrg--l" on:click={() => (show = false)}>
      <Svg id="close" w="8" h="8" />
    </button>
  </section>
{/if}

<style>
  section {
    padding: 16px 24px;
    background: var(--orange-light-1);
  }

  .warning {
    fill: var(--orange-hover);
  }

  button {
    --color: var(--waterloo);
    --color-hover: var(--black);
  }
</style>
