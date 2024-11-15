<script lang="ts">
  import type { Step } from './types'

  import Section from './Section.svelte'
  import Channel from './Channel.svelte'
  import { useCustomerCtx } from 'san-webkit-next/ctx/customer'

  export let channel: Step['value']['channel']

  const { currentUser: _currentUser } = useCustomerCtx()
  const currentUser = _currentUser.$$!

  $: settings = currentUser.settings
  $: ({ alertNotifyEmail, alertNotifyTelegram } = settings)

  $: console.log(channel)
</script>

<Section title="Alert action">
  <Channel bind:channel source="email" disabled={!alertNotifyEmail}>
    Email

    <span slot="right" class="c-waterloo">
      {currentUser.email}
    </span>
  </Channel>

  <!--  TODO: Support web-push via service worker [@vanguard | 22 Mar, 2023]  -->
  <!-- <Channel bind:channel source="push" disabled> -->
  <!--   Push -->
  <!---->
  <!--   <span slot="right" class="c-waterloo">Get fast notifications</span> -->
  <!-- </Channel> -->

  <Channel bind:channel source="telegram" disabled={!alertNotifyTelegram}>
    Telegram

    <div slot="right" class="c-waterloo">
      You will receive notifications to the connected telegram account
    </div>
  </Channel>

  <Channel bind:channel source="telegram_channel" defaultValue="">
    Telegram public channel

    <input
      slot="right"
      placeholder="@Channel name"
      type="text"
      class="input border"
      disabled={channel.telegram_channel === undefined}
      bind:value={channel.telegram_channel}
    />

    <svelte:fragment slot="bottom">
      To allow notification for your telegram channel. Open your telegram channel, press info, go to
      Administrators, add Admin. Search for Santiment Signals bot. The Signals bot must be made an
      admin of the channel with only Post Messages privileges.
      <button class="btn-0">Show a screenshot</button>
    </svelte:fragment>
  </Channel>

  <Channel bind:channel source="webhook" defaultValue="">
    Webhook URL

    <input
      slot="right"
      placeholder="https://"
      type="text"
      class="input border"
      bind:value={channel.webhook}
      disabled={channel.webhook === undefined}
    />
  </Channel>
</Section>

<style>
  [disabled] {
    background: var(--athens);
    color: var(--mystic);
  }
</style>
