<script>
  import Svg from 'webkit/ui/Svg/svelte'
  import { FeatureWalkthrough$ } from 'webkit/ui/FeatureWalkthrough/context'
  import { newChartColors } from 'studio/Chart/colors'
  import Parameter from './Query/Parameter.svelte'
  import ExecuteButton from './Query/ExecuteButton.svelte'
  import RowPanels from './RowPanels.svelte'
  import { showParameterDialog } from './ParameterDialog.svelte'
  import { onMount } from 'svelte'
  import { mutateComputeRawClickhouseQuery } from './api/rawQuery'

  export let data

  let controlsNode
  let queryNode

  const parameters = [0, 1, 2, 3, 4].map((v) => ({ key: v }))

  $: colors = newChartColors(parameters)
  $: if (controlsNode) {
    const node = controlsNode.querySelector('.parameter')
    node.id = 'fw-parameter-options'

    false &&
      FeatureWalkthrough$.show({
        id: node.id,
        title: 'Parameter options',
        description: `<p class="mrg-l mrg--b">Click on the parameter to open the options dialog</p>`,
      })
  }

  function onExecuteClick(resolve) {
    const query = queryNode.value
    mutateComputeRawClickhouseQuery({
      query,
    }).then((sqlResult) => {
      data = sqlResult
      resolve()
    })
  }

  onMount(() => {
    false &&
      FeatureWalkthrough$.show({
        id: 'fw-add-parameter',
        title: 'Add parameter',
        description: `<p class="mrg-l mrg--b">Click on the parameter to open the options dialog</p>`,
      })
  })
</script>

<div class="row mrg-l mrg--b">
  <div class="controls row" bind:this={controlsNode}>
    <ExecuteButton onClick={onExecuteClick} />

    {#each parameters as parameter}
      <Parameter class="parameter" color={colors[parameter.key]} />
    {/each}
  </div>

  <button
    id="fw-add-parameter"
    class="add btn row v-center mrg-a mrg--l nowrap"
    on:click={() => showParameterDialog()}>
    <Svg id="braces" w="16" class="mrg-s mrg--r" />
    Add parameter</button>
</div>

<RowPanels class="mrg-xl mrg--b">
  <svelte:fragment slot="left">
    <textarea
      bind:this={queryNode}
      cols="30"
      rows="10"
      value="SELECT * FROM intraday_metrics LIMIT 20" />
  </svelte:fragment>

  <!-- 
    <svelte:fragment slot="right">
      <div class="row nowrap">
        <button class="btn-1 btn--accent">Run Query</button>
        <div class="caption mrg-l mrg--l">
          Last run <b>3 min ago</b>
          <br />
          Avg. running time <b>1 min</b>
        </div>
      </div>

      <div class="scroll">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui maiores ipsum non eaque dicta
        est excepturi molestias distinctio quos ducimus tenetur commodi nobis corrupti eum enim
        eveniet, harum tempora fugit voluptatum! Quia laudantium sapiente sit fugit voluptatum
        dolores vitae cupiditate officia tempora, adipisci, cumque libero repudiandae et a tempore
        quo quis quasi consequuntur maxime, quos voluptatem ratione facere possimus. Repellat
        delectus et consequatur dolores rem explicabo ut illum, placeat sed dicta ipsa sequi magnam
        optio fugit rerum sit totam maxime? Aliquid fugiat, incidunt repudiandae aperiam pariatur
        maiores corporis omnis accusamus praesentium fuga rem nam aliquam natus minima, quisquam
        adipisci odio?
      </div>
    </svelte:fragment>
 -->
</RowPanels>

<style>
  .controls {
    gap: 8px;
    flex-wrap: wrap;
  }

  textarea {
    resize: none;
    width: 100%;
    height: 100%;
  }

  /*

  b {
    font-weight: bold;
  }

  button {
     padding: 6px 31px; 
  }

  .scroll {
    margin: 12px -16px 0 0;
  }
*/

  .add {
    --fill: var(--waterloo);
    --color-hover: var(--green);
    height: 32px;
    align-self: flex-start;
  }
</style>
