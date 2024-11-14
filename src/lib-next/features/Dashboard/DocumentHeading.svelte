<script lang="ts">
  import ContentEditable from '$lib-next/ContentEditable.svelte'
  import { useDashboardCtx } from './ctx'

  type TProps = { onChange: () => void }
  let { onChange }: TProps = $props()

  const { dashboard } = useDashboardCtx.get()
  const { isReadonly } = dashboard

  const { name, description } = dashboard.state.$$

  function onFieldBlur(name: 'name' | 'description', value: string) {
    dashboard.state.$$[name] = value
    onChange()
  }
</script>

<section class="gap-1 column">
  <ContentEditable
    as="h1"
    class="text-2xl font-medium"
    placeholder="Add your title here..."
    readonly={isReadonly}
    defaultValue={name}
    onBlur={(value) => onFieldBlur('name', value)}
  ></ContentEditable>

  <ContentEditable
    as="p"
    class="text-base"
    placeholder="Add description here..."
    readonly={isReadonly}
    defaultValue={description}
    onBlur={(value) => onFieldBlur('description', value)}
  ></ContentEditable>
</section>
