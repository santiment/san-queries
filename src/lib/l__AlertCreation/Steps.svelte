<script lang="ts">
  import Svg from 'san-webkit/lib/ui/Svg/svelte'

  export let steps: App.Alerts.Step[]
  export let stepIndex: number
</script>

<nav>
  {#each steps as item, i}
    {@const { title, description, valid, value, StepValue } = item}
    {@const active = stepIndex === i}
    {@const next = !valid && (steps[i - 1] ? steps[i - 1].valid : true)}

    <button
      class="btn row relative"
      class:active
      class:valid
      class:next
      on:click={() => (stepIndex = i)}
    >
      <span class="row hv-center mr-3 text-white">
        {#if valid}
          <Svg id="checkmark" w="8" />
        {:else}
          {i + 1}
        {/if}
      </span>

      <div class="right">
        <h3 class="body-2 c-parent text-left">{title}</h3>
        {#if valid && StepValue}
          <div class="values row mt-2 text-left text-fiord">
            <svelte:component this={StepValue} {value} />
          </div>
        {:else if active}
          <p class="text-left text-fiord">
            {description}
          </p>
        {/if}
      </div>
    </button>
  {/each}
</nav>

<style lang="scss">
  button {
    --color: var(--casper);
    padding: 0 0 20px;
    pointer-events: none;
    max-width: 100%;

    &::before {
      content: '';
      display: block;
      width: 1px;
      position: absolute;
      top: 0;
      bottom: 0;
      background: var(--porcelain);
      left: 12px;
      z-index: -1;
    }

    &:last-child::before {
      display: none;
    }
  }

  .right {
    min-width: 0;
  }

  span {
    fill: var(--white);
    background: var(--circle, var(--mystic));
    border-radius: 50%;
    width: 24px;
    min-width: 24px;
    height: 24px;
  }

  .values {
    flex-wrap: wrap;
    gap: 8px;
  }

  .valid {
    --color: var(--black);
    --circle: var(--green);
    --color-hover: var(--green);
  }

  .next {
    --circle: var(--waterloo);
    --color: var(--fiord);
  }

  .valid,
  .next {
    pointer-events: all;
    --color-hover: var(--green);
  }

  .active {
    --circle: var(--green);
    --color: var(--green);
  }
</style>
