<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import Component from './index.svelte'

  export const showVisualisationFullscreenDialog = (props: {
    title: string
    sqlData: App.SqlData
  }) => dialogs.__show(Component, props)
</script>

<script lang="ts">
  import Dialog from 'webkit/ui/Dialog'
  import Table from '$lib/QueryEditor/Visualisation/Table.svelte'

  export let title: string
  export let sqlData: App.SqlData
</script>

<Dialog {...$$props} {title}>
  <Table border={false} {sqlData} />
</Dialog>

<style lang="scss">
  Dialog {
    min-width: 90%;
    min-height: 80%;
  }
</style>
