<script>
  import { ONE_SECOND_IN_MS } from 'san-webkit/lib/utils/dates'
  import { onDestroy, onMount } from 'svelte'

  export let stats
  export let lastRun

  const format = (int) => (int > 9 ? int : '0' + int)

  let interval
  let seconds = 1
  let minutes = 0

  onMount(() => {
    const diff = Date.now() - lastRun

    seconds = Math.ceil(diff / ONE_SECOND_IN_MS)
    minutes = Math.floor(seconds / 60)
    seconds %= 60

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

Currently running <span class="txt-b">{format(minutes)}:{format(seconds)}</span>

<style>
  span {
    display: inline-block;
    width: 5ch;
  }
</style>
