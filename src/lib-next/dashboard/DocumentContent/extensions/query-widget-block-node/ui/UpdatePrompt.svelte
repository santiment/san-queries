<script lang="ts">
  import Button from 'san-webkit-next/ui/core/Button'

  type TProps = { isOpened: boolean }
  let { isOpened = $bindable(false) }: TProps = $props()
</script>

{#if isOpened}
  <div
    class="absolute left-0 top-0 z-[2] flex h-full w-full items-center justify-center bg-white/70"
  >
    <div class="relative flex rounded bg-athens px-9 py-7 text-center column">
      <h3 class="body-2 font-semibold">The query is out-of-date</h3>
      <p class="mb-4 text-xs">Click bellow to update it</p>

      <Button icon="refresh" variant="border" class="self-center">Update query</Button>

      <Button
        icon="close"
        iconSize={8}
        class="absolute right-0.5 top-0.5 fill-waterloo"
        onclick={() => (isOpened = false)}
      ></Button>
    </div>
  </div>
{/if}
