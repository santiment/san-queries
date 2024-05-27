<script lang="ts">
  import { ssd } from 'svelte-runes'
  import HexInput from './HexInput.svelte'
  // TODO: Refactor and move to san-webkit [@vanguard | Jun 16, 2021]
  import { hsvToHex, hexToHsv, SUGGESTIONS } from './utils'

  let { color, suggestions = SUGGESTIONS, onChange } = $props()

  let uppercaseColor = $derived(color.toUpperCase())
  const hsv = ssd(() => {
    const [hue, saturation, brightness] = hexToHsv(color)
    return { hue, saturation, brightness }
  })

  $effect(() => {
    parseHSV(hsv.$.hue, hsv.$.saturation, hsv.$.brightness)
  })

  function parseHSV(hue, saturation, brightness) {
    const newColor = hsvToHex(hue / 360, saturation / 100, brightness / 100)
    if (uppercaseColor !== newColor.toUpperCase()) onChange(newColor)
  }

  function newMouseHandler(moveHandler) {
    return (e) => {
      const clientRect = e.currentTarget?.getBoundingClientRect()
      const onMouseMove = (e: MouseEvent) => moveHandler(e, clientRect)

      onMouseMove(e)
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)

      function onMouseUp() {
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', onMouseUp)
      }
    }
  }

  const onSaturationMouseDown = newMouseHandler(({ clientX, clientY }, clientRect) => {
    const { left, right, top, bottom, width, height } = clientRect

    if (clientX < left) hsv.$.saturation = 0
    else if (clientX > right) hsv.$.saturation = 100
    else hsv.$.saturation = ((clientX - left) / width) * 100

    if (clientY < top) hsv.$.brightness = 100
    else if (clientY > bottom) hsv.$.brightness = 0
    else hsv.$.brightness = 100 - ((clientY - top) / height) * 100

    hsv.$ = hsv.$
  })

  const onHueMouseDown = newMouseHandler(({ clientX }, clientRect) => {
    const { left, right, width } = clientRect

    if (clientX < left) hsv.$.hue = 0
    else if (clientX > right) hsv.$.hue = 360
    else hsv.$.hue = ((clientX - left) / width) * 360

    hsv.$ = hsv.$
  })
</script>

<div class="picker max-w-[250px] border">
  <div class="wbc" onmousedown={onSaturationMouseDown}>
    <div
      class="wbc-cursor"
      style="--saturation:{hsv.$.saturation};--brightness:{hsv.$.brightness}"
    />
    <div class="wbc-color" style="--hue:{hsv.$.hue}">
      <div class="wbc-white">
        <div class="wbc-black" />
      </div>
    </div>
  </div>
  <div style="--hue:{hsv.$.hue}" class="hue" onmousedown={onHueMouseDown}>
    <div class="hue-cursor" />
  </div>

  <HexInput color={uppercaseColor} {onChange} />

  <div class="suggestions flex">
    {#each suggestions as suggestion}
      <div
        class="suggestion"
        class:active={suggestion === uppercaseColor}
        onclick={() => onChange(suggestion)}
        style="--color:{suggestion}"
      />
    {/each}
  </div>
</div>

<style>
  .picker {
    min-width: 200px;
    padding: 10px;
    border: none;
    user-select: none !important;
  }

  .wbc {
    height: 150px;
    position: relative;
    cursor: pointer;
    overflow: hidden;
  }

  .wbc-cursor {
    position: absolute;
    border-radius: 50%;
    border: 2px solid #fff;
    width: 9px;
    height: 9px;
    box-shadow:
      0 0 1px #00000055,
      #00000055 0px 0px 1px 0px inset;

    left: calc(var(--saturation) * 1%);
    bottom: calc(var(--brightness) * 1%);
    transform: translate(-50%, 50%);
  }

  .wbc-white,
  .wbc-black,
  .wbc-color {
    width: 100%;
    height: 100%;
    inset: 0;
  }

  .wbc-color {
    background: hsl(var(--hue), 100%, 50%);
  }

  .wbc-white {
    background: linear-gradient(to right, rgb(255, 255, 255), rgba(255, 255, 255, 0));
  }

  .wbc-black {
    background: linear-gradient(to top, rgb(0, 0, 0), rgba(0, 0, 0, 0));
  }

  .hue {
    cursor: pointer;
    position: relative;
    margin: 10px 0;
    height: 10px;
    background: linear-gradient(
      to right,
      rgb(255, 0, 0) 0%,
      rgb(255, 255, 0) 17%,
      rgb(0, 255, 0) 33%,
      rgb(0, 255, 255) 50%,
      rgb(0, 0, 255) 67%,
      rgb(255, 0, 255) 83%,
      rgb(255, 0, 0) 100%
    );
  }

  .hue-cursor {
    position: absolute;
    height: 8px;
    width: 4px;
    background: #fff;
    box-shadow: 0 0 2px 0.5px #00000055;
    top: 1px;
    border-radius: 1px;
    left: calc(var(--hue) * 0.277%);
    transform: translateX(-50%);
  }

  .suggestions {
    margin-right: -10px;
    margin: 0 -10px -10px;
    flex-wrap: wrap;
    border-top: 1px solid var(--porcelain);
    padding: 10px 0 0 10px;
  }
  .suggestion {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    background: var(--color);
    margin: 0 10px 10px 0;
    border: 1px solid #00000033;
    cursor: pointer;
  }
  .active {
    box-shadow: var(--color) 0 0 5px;
  }
</style>
