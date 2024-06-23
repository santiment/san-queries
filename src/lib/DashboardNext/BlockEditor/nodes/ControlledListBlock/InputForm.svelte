<script lang="ts">
  import Input from 'san-webkit-next/ui/core/Input'
  import Button from 'san-webkit-next/ui/core/Button'
  import { useControllerListCtx } from './ctx'

  let value = $state<string>('')

  const { addInputValue } = useControllerListCtx()

  function onsubmit(e: Event) {
    e.preventDefault()

    const form = e.currentTarget as HTMLFormElement
    form.reset()

    addInputValue(value)

    value = ''
  }
</script>

<form class="gap-2 row" {onsubmit}>
  <Input
    class="flex-1"
    icon="add-list"
    iconSize="12"
    placeholder="Input new value and press enter"
    oninput={(e) => (value = e.currentTarget.value)}
  ></Input>
  <Button type="submit" variant="fill" disabled={!value.trim()}>Add</Button>
</form>
