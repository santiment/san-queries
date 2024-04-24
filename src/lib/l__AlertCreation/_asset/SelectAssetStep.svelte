<script lang="ts">
  import type { Value, Asset } from './types'

  import ListOfAssetsMulti from 'san-webkit/lib/ui/ListOfAssets/Multi.svelte'
  import { TABS } from 'san-webkit/lib/ui/ListOfAssets/Tabs.svelte'
  import { queryAllProjects } from 'san-studio/lib/api/project'

  TABS[0][1] = queryAllProjects

  export let step: App.Alerts.Step<Value, Asset[]>

  let assets = new Set(step.value.target)

  function onSelect(assets: Asset[]) {
    step.value.target = assets
  }
</script>

<ListOfAssetsMulti selected={assets} {onSelect} />
