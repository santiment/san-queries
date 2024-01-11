<script lang="ts">
  import { getDashboardEditor$Ctx } from '$routes/(editor)/dashboard/[[slug]]/ctx'
  import { showEditGlobalParameterDialog$ } from '../EditGlobalParameterDialog.svelte'
  import {
    mutateAddDashboardGlobalParameter,
    mutateDeleteDashboardGlobalParameter,
    mutateUpdateDashboardGlobalParameter,
    mutateAddDashboardGlobalParameterOverride,
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
      }).then(() => {
        dashboardEditor$.addParameter(parameter)

        // overrideParameter(parameter)
      })
    })
  }

  function onLinkClick(parameter) {
    const { key } = parameter
    console.log(parameter)
    showEditGlobalParameterDialog({ parameter }).then((newParameter) => {
      dashboardEditor$.updateParameter(parameter, newParameter)

      mutateUpdateDashboardGlobalParameter({
        dashboardId,
        key,
        newKey: newParameter.key,
        newValue: { string: newParameter.value },
      }).then(() => {
        overrideParameter(parameter)
      })
    })
  }

  function onRemoveClick(parameter, i: number) {
    mutateDeleteDashboardGlobalParameter({ dashboardId, key: parameter.key }).then(() => {
      dashboardEditor$.removeParameter(parameter, i)
    })
  }

  function overrideParameter(parameter: any) {
    const { overrides } = parameter
    return Object.keys(overrides)
      .flatMap((queryId) =>
        Object.keys(overrides[queryId]).map((queryParameterKey) => ({
          dashboardId,
          dashboardParameterKey: parameter.key,
          queryParameterKey,
          dashboardQueryMappingId: queryId,
        })),
      )
      .map((variables) => {
        return mutateAddDashboardGlobalParameterOverride(variables)
      })
  }
</script>

<parameters class="row gap-s mrg-l mrg--b">
  {#if !dashboardEditor.isLegacy}
    <button class="btn-2" on:click={onAddGlobalParameterClick}>Add global parameter</button>
  {/if}

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
