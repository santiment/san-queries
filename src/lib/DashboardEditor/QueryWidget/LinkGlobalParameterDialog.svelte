<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import Component from './LinkGlobalParameterDialog.svelte'

  export const showLinkGlobalParameterDialog$ = () => dialogs.__WithCtx(Component)
</script>

<script lang="ts">
  import Dialog from 'webkit/ui/Dialog'
  import { getDashboardEditor$Ctx } from '$routes/(editor)/dashboard/[[slug]]/ctx'
  import Checkbox from 'webkit/ui/Checkbox.svelte'
  import Parameter, { COLORS } from '$lib/Parameter'

  export let widget: any
  export let parameter: any
  export let DialogCtx: SAN.Dialog.Ctx
  export let globalParameter: any

  const { key } = parameter
  const { dashboardEditor$ } = getDashboardEditor$Ctx()

  $: dashboardEditor = $dashboardEditor$
  $: parameters = dashboardEditor.parameters

  function onAddClick() {
    DialogCtx.resolve(globalParameter)
    DialogCtx.close()
  }

  function onToggle(parameter) {
    globalParameter = globalParameter === parameter ? null : parameter
  }
</script>

<Dialog {...$$props} title="Link to global parameter">
  <div class="dialog-body column gap-l">
    {#if parameters.length}
      <queries class="column gap-l">
        <h3 class="body-1 txt-m">Link this local parameter to one of these global parameters</h3>

        {#each parameters as parameter, i}
          <global-parameter class="row v-center gap-s">
            <Checkbox
              isActive={parameter === globalParameter}
              on:click={() => onToggle(parameter)}
            />

            <Parameter {parameter} color={COLORS[i]} />
          </global-parameter>
        {/each}
      </queries>
    {/if}

    <actions class="row gap-l mrg-l mrg--t">
      <button
        class="btn-1"
        on:click={onAddClick}
        class:disabled={!parameter.key || !parameter.value}
      >
        {key ? 'Edit' : 'Add'}
      </button>
      <button class="btn-2" on:click={() => DialogCtx.close()}>Cancel</button>
    </actions>
  </div>
</Dialog>

<style lang="scss">
  Dialog {
    width: 600px;
  }
</style>
