<script lang="ts">
  import Tooltip from 'san-webkit-next/ui/core/Tooltip'

  import arrowDay from './arrow-day.svg'
  import arrowNight from './arrow-night.svg'
  import { useUiCtx } from 'san-webkit-next/ctx/ui'
  import type { TAssetInfoData } from './api'
  import Button from 'san-webkit-next/ui/core/Button'

  let { data }: { data: TAssetInfoData } = $props()

  const { ui } = useUiCtx()

  const arrowWidth = 12
  const arrowHeight = 49
  const MAX_ANGLE = 80

  const negative = $derived(data.sentiment_negative_total || 1)
  const positive = $derived(data.sentiment_positive_total || 1)
  const max = $derived(Math.max(negative, positive))
  const min = $derived(Math.min(negative, positive))
  const angle = $derived(getAngle(negative, positive))

  function getAbsAngle() {
    const diff = 1 - min / max
    let scaleFactor = 1

    if (max < 10) {
      scaleFactor = 0.1
    } else if (max < 20) {
      scaleFactor = 0.2
    } else if (max < 30) {
      scaleFactor = 0.3
    } else if (max < 60) {
      scaleFactor = 0.5
    }

    return MAX_ANGLE * diff * scaleFactor
  }

  function getAngleSign(negative: number, positive: number) {
    return negative > positive ? -1 : 1
  }

  function getAngle(negative: number, positive: number) {
    return getAngleSign(negative, positive) * getAbsAngle()
  }
</script>

<article class="gap-s v-center column">
  <figure class="relative">
    <svg width="104" height="52" fill="none" xmlns="http://www.w3.org/2000/svg"
      ><path
        d="M68.7 23 78 7a52 52 0 0 0-26-7v18.4c6.1 0 11.8 1.7 16.7 4.5Z"
        fill="var(--yellow,#FFCB47)"
      /><path
        d="M35.3 23 26 7A52.1 52.1 0 0 0 7 25.8L23 35c3-5 7.2-9.3 12.3-12.2Z"
        fill="var(--orange-hover,#FD9317)"
      /><path
        d="M52 18.4V0a52 52 0 0 0-26 7l9.3 16c4.9-3 10.6-4.6 16.7-4.6Z"
        fill="var(--orange,#FFAD4D)"
      /><path
        d="m81 35 16-9A52.1 52.1 0 0 0 78 7l-9.3 16c5.1 3 9.3 7 12.3 12.1Z"
        fill="var(--green-light-3,#B0EBDB)"
      /><path
        d="M85.5 51.7H104c0-9.4-2.5-18.2-7-25.8L81 35a33 33 0 0 1 4.5 16.6Z"
        fill="var(--green-light-2,#DCF6EF)"
      /><path
        d="M18.5 51.7A33 33 0 0 1 23 35.1L7 25.9c-4.5 7.6-7 16.4-7 25.8h18.5Z"
        fill="var(--red,#FF6363)"
      /></svg
    >

    <img
      class="arrow"
      style="--w: {arrowWidth}px; --h: {arrowHeight}px; --angle: {angle}deg"
      width={arrowWidth}
      src={ui.$$.isNightMode ? arrowNight : arrowDay}
      alt="gauge arrow"
    />
  </figure>

  <p class="caption flex w-full items-center justify-between text-waterloo">
    <span>Bearish</span>

    <Tooltip position="bottom">
      {#snippet children({ ref })}
        <Button {ref} icon="info" iconSize="12"></Button>
      {/snippet}

      {#snippet content()}
        <tooltip class="c-fiord body-3 txt-r">
          This widget shows aggregated sentiment of the crowd and not Santiment's trading advice
        </tooltip>
      {/snippet}
    </Tooltip>

    <span>Bullish</span>
  </p>
</article>

<style lang="scss">
  article {
    width: 104px;
  }

  figure {
    height: 58px;
  }

  .arrow {
    --circle-center: calc(var(--w) / 2);

    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%) rotate(var(--angle));
    transform-origin: var(--circle-center) calc(var(--h) - var(--circle-center));
  }

  p {
    text-transform: capitalize;
    font-size: 11px;
  }

  tooltip {
    padding: 14px 20px;
    max-width: 232px;
    text-transform: initial;
  }
</style>
