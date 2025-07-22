<script lang="ts">
  import { Mode, type TMode } from 'san-webkit-next/ui/app/Chart/types'
  import Button from 'san-webkit-next/ui/core/Button'
  import { cn } from 'san-webkit-next/ui/utils'
  import { CMD } from 'san-webkit/src/utils/os'

  type TProps = { mode: TMode; onFullscreenClick?: () => void }

  let { mode = $bindable(Mode.DRAG), onFullscreenClick }: TProps = $props()
</script>

<section class="mb-4 flex items-center gap-2">
  <div class="flex gap-2">
    <Button
      onclick={() => (mode = Mode.DRAG)}
      icon="cursor-pointer"
      iconSize="14"
      iconHeight="17"
      explanation="Drag mode"
      class={cn(mode === Mode.DRAG && 'bg-athens fill-black')}
    ></Button>
    <Button
      onclick={() => (mode = Mode.SHIFT)}
      icon="shift-arrow"
      explanation="Shift mode (hold Shift)"
      class={cn(mode === Mode.SHIFT && 'bg-athens fill-black')}
    ></Button>
    <Button
      onclick={() => (mode = Mode.ZOOM)}
      icon="zoom"
      explanation="Zoom mode (hold {CMD})"
      class={cn(mode === Mode.ZOOM && 'bg-athens fill-black')}
    ></Button>

    {#if false}
      <Button icon="line" explanation="Trend line"></Button>
      <Button icon="hray" explanation="Horizontal ray"></Button>
      <Button icon="smile" explanation="Emojis"></Button>
      <Button icon="editor/title" explanation="Text" iconSize="13"></Button>
      <Button icon="eye" explanation="Hide drawings"></Button>
      <Button icon="delete" explanation="Remove drawing"></Button>
    {/if}
  </div>

  <div class="ml-auto flex gap-2">
    <Button icon="download" class="gap-2" explanation="Download CSV">CSV</Button>
    <Button icon="download" class="gap-2" explanation="Download PNG">PNG</Button>

    <!--
    <Button icon="embed" iconSize="20" explanation="Embed chart"></Button>
    -->
    {#if onFullscreenClick}
      <Button
        icon="fullscreen"
        iconSize={14}
        explanation="Open in fullscreen"
        onclick={onFullscreenClick}
      ></Button>
    {/if}
  </div>
</section>
