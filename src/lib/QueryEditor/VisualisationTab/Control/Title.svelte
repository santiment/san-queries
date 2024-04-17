<script lang="ts">
  import { useQuerySettingsCtx } from '$lib/QueryEditor/ctx'
  import Field from '$lib/ui/Field/Field.svelte'
  import Input from '$lib/ui/Input.svelte'

  let { column, value }: { column: string; value?: string } = $props()

  const querySettingsCtx = useQuerySettingsCtx()

  function onInput(e: Event) {
    const inputNode = e.currentTarget as HTMLInputElement

    querySettingsCtx.applyColumnSettings(column, { title: inputNode.value.trim() })
  }

  function onBlur(e: Event) {
    const inputNode = e.currentTarget as HTMLInputElement

    inputNode.value = inputNode.value.trim()
  }
</script>

<Field name="Title" for="{column}_title">
  <Input {value} id="{column}_title" placeholder={column} oninput={onInput} onblur={onBlur}></Input>
</Field>
