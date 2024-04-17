<script lang="ts">
  import { cn } from '../utils'

  export let color: string
  export let onChange: (color: string) => void

  let value = color
  let error = false
  let wasChanged = false

  $: if (!wasChanged) value = color

  const checkIsInvalidHex = (char) => Number.isNaN(parseInt(char, 16))

  const getValues = (input: string) => (input.startsWith('#') ? input.slice(1) : input)

  const normalizeHexValues = (values: string) =>
    '#' + (values.length === 3 ? normalizeHexShorthand(values) : values)

  function normalizeHexShorthand(values: string) {
    let normalized = ''
    for (let i = values.length - 1; i > -1; i--) {
      const char = values[i]
      normalized = char + char + normalized
    }
    return normalized
  }

  function checkIsInvalidHexValues(values: string) {
    for (let i = values.length - 1; i > -1; i--) {
      if (checkIsInvalidHex(values[i])) return true
    }
    return false
  }

  function onBlur() {
    value = color
    error = false
    wasChanged = false
  }

  function onInput(e) {
    const values = getValues(value)
    const { length } = values

    if ((length !== 3 && length !== 6) || checkIsInvalidHexValues(values)) {
      return (error = true)
    }

    wasChanged = true
    error = false
    onChange(normalizeHexValues(values))
  }

  function onKeyDown(e: KeyboardEvent) {
    const { key, ctrlKey, metaKey } = e

    if (key === 'v' && (ctrlKey || metaKey)) return
    if (checkIsInvalidHex(key)) return e.preventDefault()
  }
</script>

<input
  class={cn('mb-2 flex w-full rounded border outline-none', error && 'border-red')}
  type="text"
  bind:value
  on:blur={onBlur}
  on:input={onInput}
  on:keydown={onKeyDown}
/>

<style>
  input {
    padding: 5px 8px;
    color: var(--black);
  }
  input:focus {
    border-color: var(--green);
  }
</style>
