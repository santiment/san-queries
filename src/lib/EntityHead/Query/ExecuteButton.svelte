<script lang="ts">
  import { CMD } from 'webkit/utils/os'
  import { GlobalShortcut$ } from 'webkit/utils/events'
  import { getQueryEditor$Ctx } from '$routes/query/new/ctx'
  import Tooltip from 'webkit/ui/Tooltip'

  let className = ''
  export { className as class }

  const { queryEditor$ } = getQueryEditor$Ctx()

  let loading = false
  let tooltipNode: any
  let lastRunMs = 0

  function onExecuteClick() {
    loading = true

    tooltipNode.open()
    queryEditor$.querySqlData().finally(() => {
      loading = false
    })
  }

  function runTimer(node: HTMLElement) {
    let ms = 0

    const runningTimer = window.setInterval(() => {
      ms += 25
      update()
    }, 25)

    function update() {
      node.textContent = `${ms}ms`
    }

    return {
      destroy() {
        if (ms > 0) lastRunMs = ms

        window.clearInterval(runningTimer)
      },
    }
  }

  function tooltipCloseHook(_node: HTMLElement) {
    function close(e: Event) {
      const target = e.target as HTMLElement
      if (target.classList.contains('expl-tooltip')) {
        return
      }

      tooltipNode.close()
    }

    window.addEventListener('click', close)
    window.addEventListener('keypress', close)

    return {
      destroy() {
        window.removeEventListener('click', close)
        window.removeEventListener('keypress', close)
      },
    }
  }

  const runShortcut = GlobalShortcut$('CMD+ENTER', onExecuteClick, false)
  $runShortcut
</script>

<Tooltip
  bind:this={tooltipNode}
  let:trigger
  position="bottom"
  dark
  closeDelay={0}
  openDelay={loading || lastRunMs ? 0 : 999999}
>
  <button
    use:trigger
    class="expl-tooltip {className}"
    class:loading
    on:click={onExecuteClick}
    aria-label="{CMD} + Enter"
  >
    Execute
  </button>

  <stats slot="tooltip" class="caption" use:tooltipCloseHook>
    {#if loading}
      Currently running <span class="txt-b" use:runTimer />
      <br />
    {/if}

    {#if lastRunMs}
      Last run took <b class="txt-b">{lastRunMs}</b> ms
    {/if}
  </stats>
</Tooltip>

<style>
  stats {
    display: block;
  }

  button {
    --expl-left: 50%;
    --expl-align-x: -50%;
  }

  .loading {
    pointer-events: all;
  }
</style>
