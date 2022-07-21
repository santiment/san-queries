<script>
  import { ONE_SECOND_IN_MS } from 'webkit/utils/dates'
  import { onDestroy, onMount } from 'svelte'

  export let loading
  export let stats
  export let lastRun

  const format = (int) => (int > 9 ? int : '0' + int)

  let interval
  let seconds = 1
  let minutes = 0

  $: lastRun, getRunningTime()

  function formatLoadTime(loadTime) {
    return +(loadTime / ONE_SECOND_IN_MS).toFixed(3)
  }

  function getRunningTime() {
    const diff = Date.now() - lastRun

    seconds = Math.ceil(diff / ONE_SECOND_IN_MS)
    minutes = Math.floor(seconds / 60)
    seconds %= 60
  }

  onMount(() => {
    interval = setInterval(() => {
      if (seconds >= 59) {
        minutes++
        seconds = 0
      } else {
        seconds++
      }
    }, 1000)
  })

  onDestroy(() => {
    window.clearInterval(interval)
  })
</script>

{#if loading}
  Currently running <span class="txt-b">{format(minutes)}:{format(seconds)}</span>
  <br />
{/if}

{#if stats}
  Last run took <b class="txt-b">{formatLoadTime(stats.loadTime)}</b> seconds
{/if}

<style>
  span {
    display: inline-block;
    width: 5ch;
  }
</style>
