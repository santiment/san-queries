<script>
  import Svg from 'webkit/ui/Svg/svelte'
  import { getDashboardEditor$Ctx } from './ctx'

  const { dashboardEditor$ } = getDashboardEditor$Ctx()

  function onHeadingClick() {
    dashboardEditor$.addWidget('HEADING')
  }

  function onTextClick() {
    dashboardEditor$.addWidget()
  }
</script>

<actions class="row gap-l caption">
  <button class="btn">
    <Svg id="query" w="16" />
    Query
  </button>
  <button class="btn">
    <Svg id="chart" w="16" />
    Chart
  </button>
  <button class="btn">
    <Svg id="image" w="16" />
    Image
  </button>
  <button class="btn" on:click={onHeadingClick}>
    <Svg id="editor/heading" w="16" />
    Heading
  </button>
  <button class="btn" on:click={onTextClick}>
    <Svg id="editor/title" w="16" />
    Text
  </button>
</actions>

<style>
  actions {
    position: fixed;
    bottom: 24px;
    padding: 8px 24px;
    background: #2f354d;
    fill: #fff;
    color: #fff;
    border-radius: 6px;
    align-self: center;
  }

  button {
    gap: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 10px;
    padding-top: 8px;
    --color-hover: var(--green);
    min-width: 32px;
  }
</style>
