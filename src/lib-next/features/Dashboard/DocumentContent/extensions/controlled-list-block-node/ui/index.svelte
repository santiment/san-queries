<script lang="ts">
  import type { CONTROLLED_LIST_BLOCK_NODE } from '../schema'
  import type { TGlobalParametersWidgetProps } from '../../schema/global-parameter'

  import DataTable from '$lib/ui/Table/DataTable.svelte'
  import InputForm from './InputForm.svelte'
  import { COLUMNS, useControllerListCtx } from '../ctx'

  let { view, data }: TGlobalParametersWidgetProps<typeof CONTROLLED_LIST_BLOCK_NODE> = $props()

  const { globalParameter } = useControllerListCtx(view, data.widget)
  const { state } = globalParameter
</script>

<div class="flex-1 rounded border column">
  {#key state.$$.value}
    <DataTable
      class="column [&>table]:flex-1"
      data={state.$$.value}
      columns={COLUMNS}
      pagination={false}
      minRows={4}
    >
      <tfoot>
        <tr class="border-t">
          <td>
            <InputForm></InputForm>
          </td>
        </tr>
      </tfoot>
    </DataTable>
  {/key}
</div>

<style lang="postcss">
  div :global {
    tbody td:empty {
      @apply h-[37px];
    }
  }
</style>
