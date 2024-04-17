<script lang="ts">
  let { id, stats }: { id?: string; stats: App.ExecutionStats } = $props()
</script>

<div class="flex min-h-[270px] min-w-[310px] flex-col divide-y">
  <stat>Query ID <value>{stats.id || id}</value></stat>
  <stat>Credits used <value>{stats.creditsCost}</value></stat>
  <stat>Duration <value>{stats.queryDurationMs} ms</value></stat>
  <stat>GB read <value>{stats.readGb} GB</value></stat>
  <stat>Rows read <value>{stats.readRows}</value></stat>
  <stat>Inserted at <value>{stats.insertedAt}</value></stat>
</div>

<style>
  stat {
    @apply flex w-full justify-between gap-20 px-4  py-3;
  }
</style>
