<script>
  export let legacyDashboard

  let migrating = false
  let loaded = 1

  async function onMigrateClick() {
    if (migrating) return

    migrating = true
    console.log(legacyDashboard)

    setTimeout(() => {
      loaded = 70
    }, 100)
  }
</script>

<div class="column hv-center mrg-l mrg--t gap-l">
  <h3 class="h4">This is a legacy dashboard</h3>

  <button class="btn-1" on:click={onMigrateClick}>
    {migrating ? 'Migrating...' : 'Migrate dashboard'}
  </button>

  {#if migrating}
    <migrate-progress class="row mrg-l mrg--t">
      <progress-bar style="--loaded:{loaded}%" />
    </migrate-progress>
  {/if}
</div>

<style>
  migrate-progress {
    height: 8px;
    background: var(--athens);
    width: 500px;
    border-radius: 6px;
    overflow: hidden;
  }

  progress-bar {
    height: 100%;
    width: 100%;
    background: var(--green);
    min-width: 2px;
    transform: translateX(calc(-100% + var(--loaded)));
    transition: transform 3s cubic-bezier(0.4, 1, 1, 1);
  }
</style>
