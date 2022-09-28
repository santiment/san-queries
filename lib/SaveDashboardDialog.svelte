<script context="module" lang="ts">import { dialogs } from 'san-webkit/lib/ui/Dialog';
import SaveDashboardDialog from './SaveDashboardDialog.svelte';
export const showSaveDashboardDialog = props => dialogs.showOnce(SaveDashboardDialog, props);</script>

<script lang="ts">import 'san-webkit/lib/analytics';
import Dialog from 'san-webkit/lib/ui/Dialog';
import Field from 'san-webkit/lib/ui/Field/svelte';
import Toggle from 'san-webkit/lib/ui/Toggle.svelte';
import { startSaveFlow } from './flow/dashboard';
export let dashboard;
export let title = 'New dashboard';
export let action = 'Create';
export let DialogPromise;
let closeDialog;
let {
  title: name,
  description = '',
  isPublic
} = dashboard;
let loading = false;

function onFormSubmit() {
  if (!name) return;
  loading = true;
  Object.assign(dashboard, {
    title: name,
    description,
    isPublic
  });
  startSaveFlow(dashboard).then(() => {
    DialogPromise.resolve(dashboard);
    closeDialog();
  }).finally(() => {
    loading = false;
  });
}</script>

<Dialog bind:closeDialog {...$$props} {title} class="dialog-1SRmdB">
  <form class="dialog-body" on:submit|preventDefault={onFormSubmit}>
    <Field
      bind:value={name}
      autofocus
      required
      title="Name"
      placeholder="Name of the dashboard"
      autocomplete="off" />

    <Field title="Description">
      <textarea
        class="input border fluid"
        name="description"
        rows="4"
        bind:value={description}
        placeholder="Description of the dashboard" />
    </Field>

    <div class="row v-center mrg-xl mrg--t">
      <button class="btn-1 btn--l mrg-a mrg--r" class:loading type="submit">
        {action}
      </button>

      Public
      <Toggle class="mrg-m mrg--l" isActive={isPublic} on:click={() => (isPublic = !isPublic)} />
    </div>
  </form>
</Dialog>

<style>
  :global(.dialog-1SRmdB) {
    width: 480px;
  }

  .btn-1 {
    --h-padding: 30px;
  }
</style>
