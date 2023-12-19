<script lang="ts">
  import { getDashboardEditor$Ctx } from '$routes/(editor)/dashboard/[[slug]]/ctx'
  import { showEditGlobalParameterDialog$ } from '../EditGlobalParameterDialog.svelte'
  import { mutateAddDashboardGlobalParameter } from './api'
  import Parameter, { COLORS } from '$lib/Parameter'

  const showEditGlobalParameterDialog = showEditGlobalParameterDialog$()
  const { dashboardEditor$ } = getDashboardEditor$Ctx()

  $: dashboardEditor = $dashboardEditor$
  $: parameters = dashboardEditor.parameters

  function onAddGlobalParameterClick() {
    if (!dashboardEditor.dashboard?.id) return

    showEditGlobalParameterDialog().then((parameter) => {
      mutateAddDashboardGlobalParameter({
        dashboardId: dashboardEditor.dashboard.id,
        key: parameter.key,
        value: { string: parameter.value },
      }).then((parameter) => {
        console.log(parameter)
        // dashboardEditor$.addParameter(parameter)
      })
    })
  }
</script>

<parameters class="row gap-s mrg-l mrg--b">
  <button class="btn-2" on:click={onAddGlobalParameterClick}>Add global parameter</button>

  {#each parameters as parameter, i}
    <Parameter
      {parameter}
      color={COLORS[i]}
      onLinkClick={console.log}
      onRemoveClick={console.log}
    />
  {/each}
</parameters>

<style>
</style>
