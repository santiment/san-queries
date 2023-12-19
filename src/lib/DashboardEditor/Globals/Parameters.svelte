<script lang="ts">
  import { getDashboardEditor$Ctx } from '$routes/(editor)/dashboard/[[slug]]/ctx'
  import { showEditGlobalParameterDialog$ } from '../EditGlobalParameterDialog.svelte'
  import {
    mutateAddDashboardGlobalParameter,
    mutateDeleteDashboardGlobalParameter,
    mutateUpdateDashboardGlobalParameter,
  } from './api'
  import Parameter, { COLORS } from '$lib/Parameter'

  const showEditGlobalParameterDialog = showEditGlobalParameterDialog$()
  const { dashboardEditor$ } = getDashboardEditor$Ctx()

  $: dashboardEditor = $dashboardEditor$
  $: parameters = dashboardEditor.parameters
  $: dashboardId = dashboardEditor.dashboard?.id || 0

  function onAddGlobalParameterClick() {
    if (!dashboardId) return

    showEditGlobalParameterDialog().then((parameter) => {
      mutateAddDashboardGlobalParameter({
        dashboardId,
        key: parameter.key,
        value: { string: parameter.value },
      }).then((parameter) => {
        console.log(parameter)
        // dashboardEditor$.addParameter(parameter)
      })
    })
  }

  function onLinkClick(parameter) {
    const { key } = parameter
    showEditGlobalParameterDialog({ parameter }).then((newParameter) => {
      dashboardEditor$.updateParameter(parameter, newParameter)

      mutateUpdateDashboardGlobalParameter({
        dashboardId,
        key,
        newKey: newParameter.key,
        newValue: { string: newParameter.value },
      })
    })
  }

  function onRemoveClick(parameter, i: number) {
    mutateDeleteDashboardGlobalParameter({ dashboardId, key: parameter.key }).then(() => {
      dashboardEditor$.removeParameter(parameter, i)
    })
  }
</script>

<parameters class="row gap-s mrg-l mrg--b">
  <button class="btn-2" on:click={onAddGlobalParameterClick}>Add global parameter</button>

  {#each parameters as parameter, i}
    <Parameter
      {parameter}
      color={COLORS[i]}
      onLinkClick={() => onLinkClick(parameter)}
      onRemoveClick={() => onRemoveClick(parameter, i)}
    />
  {/each}
</parameters>

<style>
</style>
