<script lang="ts">
  import type { Step } from './types'
  import type { FrequencyValue } from './frequencies'

  import Checkbox from 'san-webkit/lib/ui/Checkbox.svelte'
  import Section from './Section.svelte'
  import { Frequency } from './frequencies'
  import Dropdown from '../Dropdown.svelte'

  export let step: Step
  export let cooldown: Step['value']['cooldown']

  $: disabled = step.value.isRepeating === false

  function setCooldown(amount: number, frequency: FrequencyValue) {
    cooldown.value = amount
    cooldown.type = frequency
  }

  function onInputChange(e: Event) {
    const node = e.currentTarget as HTMLInputElement
    let value = parseInt(node.value, 10)

    if (!value || value < 1) value = cooldown.value

    node.value = value.toString()
    setCooldown(value, cooldown.type)
  }
</script>

<Section title="Frequency of notifications">
  <div class="row column">
    <div class="row settings">
      <Dropdown
        class="$style.frequency"
        selected={Frequency.once_per}
        options={Object.values(Frequency)}
        onSelect={console.log}
        {disabled}
        let:option
      >
        {option.label}
      </Dropdown>

      <input
        value={cooldown.value}
        type="number"
        min="0"
        class="input border"
        {disabled}
        on:change={onInputChange}
      />

      <Dropdown
        class="min-w-[120px]"
        selected={cooldown.type}
        options={Object.values(Frequency).slice(1)}
        onSelect={(value) => setCooldown(cooldown.value, value)}
        {disabled}
        let:option
      >
        {option.label}
      </Dropdown>
    </div>

    <button
      class="row v-center mrg-m mrg--t"
      on:click={() => (step.value.isRepeating = !step.value.isRepeating)}
    >
      <Checkbox class="mrg-s mrg--r" isActive={disabled} />
      Disable after it triggers
    </button>
  </div>
</Section>

<style>
  .settings {
    gap: 8px;
  }

  .frequency {
    flex: 1;
  }

  input {
    width: 80px;
  }

  .time {
    width: 120px;
  }

  [disabled] {
    background: var(--athens);
    color: var(--mystic);
  }
</style>
