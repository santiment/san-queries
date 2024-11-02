<script lang="ts">
  import Button from 'san-webkit-next/ui/core/Button'

  type TProps = { count: number }
  let { count }: TProps = $props()

  let isOpened = $state(false)
</script>

<Button
  icon="comment"
  class="gap-1.5"
  onclick={() => {
    isOpened = true
  }}>{count}</Button
>
