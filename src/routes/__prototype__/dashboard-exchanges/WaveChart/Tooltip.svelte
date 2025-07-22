<script lang="ts">
  type TProps = {
    elem: HTMLElement | undefined
    color: string
    groupTitle: string
    date: string
    value: number
    top: number
    left: number
  }

  let { elem = $bindable(), color, groupTitle, date, value, top, left }: TProps = $props()
</script>

<tooltip
  bind:this={elem}
  class="pointer-events-none absolute flex flex-col rounded-md bg-black p-2 text-white"
  style:top="{top}px"
  style:left="{left}px"
>
  <h4 class="text-base font-semibold">{groupTitle}</h4>
  <row class="flex items-center gap-2">
    <color-box class="block size-4" style:background={color}></color-box>
    <span>x: {date}, y: {value}</span>
  </row>
</tooltip>
