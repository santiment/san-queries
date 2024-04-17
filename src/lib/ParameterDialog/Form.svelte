<script lang="ts">
  import type { Snippet } from 'svelte'

  import Button from '$lib/ui/Button.svelte'
  import * as Field from '$lib/ui/Field'
  import { cn } from '$lib/ui/utils'

  let {
    isLoading,
    parameter = $bindable(),
    onApproveClick,

    DialogCtx,
    children,
  }: {
    isLoading?: boolean
    DialogCtx: any
    onApproveClick: () => void
    parameter: App.QueryEditor['parameters'][number]
    children?: Snippet
  } = $props()

  const { key } = parameter

  function onSubmit() {
    const { key, value } = parameter

    if (typeof value === 'string') {
      parameter.value = value.trim()
    }

    if (parameter.type === 'Number') {
      parameter.value = +value
    }

    parameter.key = key.trim()

    onApproveClick()
  }
</script>

<div class="dialog-body flex flex-col gap-4">
  <Field.Input
    id="parameter-name"
    name="Name"
    value={parameter.key}
    placeholder="Name of the parameter"
    oninput={({target}) => parameter.key = (target as HTMLInputElement).value}
  ></Field.Input>

  <Field.Select
    dropdownClass="z-[200]"
    name="Type"
    options={['Text', 'Number'] as const}
    value={parameter.type}
    onChange={(type: any) => (parameter.type = type)}
  ></Field.Select>

  <Field.Input
    id="parameter-value"
    name="Value"
    value={parameter.value}
    placeholder="Default value of the parameter"
    oninput={({target}) => parameter.value = (target as HTMLInputElement).value}
  ></Field.Input>

  {@render children?.()}

  <actions class="row mt-4 gap-4">
    <Button
      variant="fill"
      onclick={onSubmit}
      disabled={!parameter.key || !parameter.value}
      class={cn(isLoading && 'loading')}
    >
      {key ? 'Edit' : 'Add'}
    </Button>

    <Button variant="border" onclick={DialogCtx.close}>Cancel</Button>
  </actions>
</div>
