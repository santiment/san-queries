<script lang="ts">
  import type { SelectedCategory } from './categories'

  import Svg from 'san-webkit/lib/ui/Svg/svelte'
  import Steps from './Steps.svelte'
  import SubmitButton from './SubmitButton.svelte'

  let selectedCategory: SelectedCategory
  export { selectedCategory as category }
  export let hasCategorySelector = true
  export let alertId: null | number = null
  export let disableSubmit = false
  export let source: string

  let stepIndex = 0
  let category = selectedCategory as NonNullable<SelectedCategory>
  let { title, steps } = category

  $: step = steps[stepIndex]
  $: nextStep = step.next || ((step.valid && steps[stepIndex + 1]) as App.Alerts.NextStep)

  $: value = step.value === undefined ? (step.value = step.new()) : step.value
  $: step.validate()
  $: step, reduceStepsToAlert(category)

  function reduceStepsToAlert(category: App.Alerts.Category) {
    category.alert = category.steps.reduce(
      (acc, step) => {
        return Object.assign(acc, step.value, { valid: acc.valid && step.valid })
      },
      { valid: true },
    ) as App.Alerts.Category['alert']
  }
</script>

<section class="row">
  <aside class="relative">
    <div class="header row justify v-center mrg-xl mrg--b">
      <h2 class="h4">{title}</h2>

      {#if hasCategorySelector}
        <button class="back btn c-waterloo row v-center" on:click={() => (selectedCategory = null)}>
          <Svg id="arrow" w="8" class="$style.arrow mrg-s mrg--r" />
          Categories
        </button>
      {/if}
    </div>

    {#key step}
      <Steps bind:stepIndex {steps} />

      <SubmitButton {alertId} {category} disabled={disableSubmit} {source} />
    {/key}
  </aside>

  <main class="column">
    <div class="row justify mrg-l mrg--b">
      <h3 class="body-1 txt-m">{step.label || step.title}</h3>

      {#if nextStep}
        {@const { label, onClick } = nextStep}

        <button class="next btn-0 row v-center" on:click={onClick || (() => (stepIndex += 1))}>
          {label}
          <Svg id="pointer" w="14" class="mrg-s mrg--l" />
        </button>
      {/if}
    </div>

    {#if step.Step}
      <svelte:component this={step.Step} {category} {value} bind:step />
    {/if}
  </main>
</section>

<style>
  section {
    flex: 1;
    min-height: 0;
  }

  aside {
    padding: 32px 40px 100px 48px;
    border-right: 1px solid var(--porcelain);
    height: 100%;
    width: 374px;
    overflow: auto;
  }

  main {
    padding: 36px 48px 32px 40px;
    flex: 1;
    overflow: auto;
  }

  .header {
    padding: 0 0 16px;
    border-bottom: 1px solid var(--porcelain);
  }

  .back {
    --color-hover: var(--green);
  }

  .arrow {
    transform: rotate(-90deg);
  }
</style>
