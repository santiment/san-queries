<script context="module">import { dialogs } from 'san-webkit/lib/ui/Dialog';
import FullscreenDialog from './FullscreenDialog.svelte';
export const showFullscreenDialog = props => dialogs.showOnce(FullscreenDialog, props);</script>

<script>import 'san-webkit/lib/analytics';
import Dialog from 'san-webkit/lib/ui/Dialog'; // import Visualization from './Visualization.svelte'

import Editor from './Async.svelte';
export let setValue;
let editor;
let closeDialog;

function onBeforeDialogClose() {
  setValue(editor.getValue());
}</script>

<Dialog
  bind:closeDialog
  {...$$props}
  {onBeforeDialogClose}
  noTitle
  animated={false}
  class="dialog-2yokat">
  <Editor bind:editor {...$$props} onFullscreenClick={closeDialog} />
</Dialog>

<style>
  :global(.dialog-2yokat) {
    width: 96%;
    height: 92%;
    padding: 16px;
  }
</style>
