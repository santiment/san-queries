<script lang="ts">
  import type { Step } from './types'

  import ToggleVisibility from 'san-webkit/lib/ui/ToggleVisibility.svelte'
  import Section from './Section.svelte'
  import Notifications from './Notifications.svelte'
  import Frequencies from './Frequency.svelte'

  export let step: Step
</script>

<Notifications bind:channel={step.value.channel} />

<Frequencies bind:step bind:cooldown={step.value.cooldown} />

<Section title="Privacy settings">
  <div class="row gap-4">
    Public
    <ToggleVisibility
      class=""
      isActive={step.value.isPublic}
      on:click={() => (step.value.isPublic = !step.value.isPublic)}
    />
  </div>
</Section>

<style>
</style>
