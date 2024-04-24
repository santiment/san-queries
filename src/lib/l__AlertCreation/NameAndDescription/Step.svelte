<script lang="ts">
  import type { Value } from './types'

  import { describe } from '../MetricsAndConditions/utils'
  import { filterValidSources } from '../NotificationsAndPrivacy/utils'

  export let category: App.Alerts.Category
  export let step: App.Alerts.Step<Value>

  if (!step.value.title) step.value.title = suggestTitle(category)
  if (!step.value.description) step.value.description = suggestDescription(category)

  step.valid = !!step.value.title

  function suggestTitle(category: App.Alerts.Category) {
    const { metric, conditions, target } = category.alert

    if (category.suggestTitle) return category.suggestTitle(category.alert)

    if (target && target.isScreener) {
      return `Project enters/exits ${getTargetTitle(category.alert)}`
    }

    return (
      `${getTargetTitle(category.alert)} ${metric?.label.toLowerCase()} ` +
      describe(metric, conditions)
    )
  }

  function suggestDescription(category: App.Alerts.Category) {
    const { metric, conditions, cooldown, channel, target } = category.alert

    if (category.suggestDescription) return category.suggestDescription(category.alert)

    if (target && target.isScreener) {
      return `Notify me when any project enters/exits ${getTargetTitle(
        category.alert,
      )}. Send me notifications every ${cooldown.value} ${
        cooldown.type.name
      }(s) via ${filterValidSources(channel).join(', ')}.`
    }

    return (
      `Notify me when the ` +
      metric?.label.toLowerCase() +
      ` of ` +
      getTargetTitle(category.alert) +
      ` ${describe(metric, conditions)}. Send me notifications every ${cooldown.value} ${
        cooldown.type.name
      }(s) via ${filterValidSources(channel).join(', ')}.`
    )
  }

  function getTargetTitle({ target }: App.Alerts.Category['alert']) {
    return target ? target.title || target.map(({ name }) => name).join(', ') : ''
  }
</script>

<label class="border column mrg-xl mrg--b" for="title">
  <p class="caption c-waterloo">Alert name</p>
  <textarea
    name="title"
    id="title"
    bind:value={step.value.title}
    on:input={() => {
      step.valid = !!step.value.title
    }}
  />
</label>

<label class="title border column" for="description">
  <p class="caption c-waterloo">Description</p>
  <textarea name="description" id="description" bind:value={step.value.description} />
</label>

<style>
  label {
    padding: 12px 16px;
  }

  #title {
    height: 50px;
  }

  #description {
    height: 90px;
  }

  textarea {
    resize: none;
    margin: 8px 0 0;
  }
</style>
