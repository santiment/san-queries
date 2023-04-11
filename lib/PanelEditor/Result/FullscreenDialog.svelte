<script context="module">import { dialogs } from 'san-webkit/lib/ui/Dialog';
import FullscreenDialog from './FullscreenDialog.svelte';
export const showFullscreenDialog = props => dialogs.showOnce(FullscreenDialog, props);</script>

<script>import 'san-webkit/lib/analytics';
import Dialog from 'san-webkit/lib/ui/Dialog';
import Visualization from './Visualization.svelte';
export let panel;
export let columns;
export let dateColumns;
export let rows;
export let visibleColumns;
let closeDialog;</script>

<Dialog bind:closeDialog {...$$props} noTitle animated={false} class="dialog-FiAGBV">
  <Visualization
    {panel}
    {columns}
    {rows}
    {dateColumns}
    {visibleColumns}
    onFullscreenClick={closeDialog} />
</Dialog>

<style>
  :global(.dialog-FiAGBV) {
    width: 96%;
    height: 92%;
    padding: 16px;
    --table-max-height: 100%;
  }
</style>
