<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import { getDashboardEditor$Ctx } from './ctx'
  import { showAddQueryToDashboardDialog } from './AddQueryToDashboardDialog/index.svelte'

  const { dashboardEditor$ } = getDashboardEditor$Ctx()

  // function onHeadingClick() {
  //   dashboardEditor$.addWidget({ type: 'HEADING', value: '' })
  // }

  function onTextClick() {
    dashboardEditor$.addWidget({ type: 'TEXT', value: '' })
  }

  function onQueryClick() {
    showAddQueryToDashboardDialog({
      onQueryAdd: () => {
        dashboardEditor$.addWidget({ type: 'QUERY', title: 'Bitcoin daily active addresses' })
      },
    })
  }

  function onImageClick(e: Event) {
    const node = e.currentTarget as HTMLElement
    const inputNode = node.querySelector('input') as HTMLInputElement

    inputNode.onchange = () => {
      const file = inputNode.files?.[0]
      if (!file) return

      dashboardEditor$.addWidget({ type: 'IMAGE', src: URL.createObjectURL(file) })
    }

    inputNode.click()
  }
</script>

<actions class="row gap-l caption">
  <button class="btn" on:click={onQueryClick}>
    <Svg id="query" w="16" />
    Query
  </button>
  <!-- <button class="btn"> -->
  <!--   <Svg id="chart" w="16" /> -->
  <!--   Chart -->
  <!-- </button> -->
  <button class="btn" on:click={onImageClick}>
    <Svg id="image" w="16" />
    Image
    <input accept="image/*" type="file" class="hide" />
  </button>
  <!-- <button class="btn" on:click={onHeadingClick}> -->
  <!--   <Svg id="editor/heading" w="16" /> -->
  <!--   Heading -->
  <!-- </button> -->
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
