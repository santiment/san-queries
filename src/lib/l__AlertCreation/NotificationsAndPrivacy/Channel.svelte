<script lang="ts">
  import type { SourceType, Step } from './types'

  import Checkbox from 'san-webkit/lib/ui/Checkbox.svelte'

  export let channel: Step['value']['channel']
  export let source: Exclude<SourceType, 'push'>
  export let disabled = false
  export let defaultValue: true | '' = true

  $: isActive = channel[source] !== undefined

  function onClick() {
    channel[source] = channel[source] !== undefined ? undefined : (defaultValue as any)
  }
</script>

<div class="column" class:disabled>
  <div class="row v-center">
    <Checkbox class="mrg-s mrg--r" {isActive} {disabled} on:click={onClick} />

    <slot />

    {#if disabled}
      <a target="_blank" href="https://app.santiment.net/account#notifications" class="btn-0 ml-2"
        >Enable notifications</a
      >
    {/if}

    <div class="right txt-right mrg-a mrg--l">
      <slot name="right" />
    </div>
  </div>

  {#if $$slots.bottom && isActive}
    <div class="bottom">
      <slot name="bottom" />
    </div>
  {/if}
</div>

<style>
  .right {
    max-width: 215px;
  }

  .bottom {
    margin: 14px 16px 0 27px;
  }

  a {
    pointer-events: all;
  }
</style>
