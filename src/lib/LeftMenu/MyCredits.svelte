<script lang="ts">
  import Tooltip from 'webkit/ui/Tooltip'
  import Svg from 'webkit/ui/Svg/svelte'
  import AccountStatus from 'webkit/ui/AccountStatus.svelte'
  // import { getCustomer$Ctx } from 'webkit/stores/customer'
  import { getCurrentUser$Ctx } from 'webkit/stores/user'

  const { currentUser$ } = getCurrentUser$Ctx()
</script>

<credits class="row justify">
  Credits left: 4567

  <Tooltip on="click" let:trigger clickaway>
    <button use:trigger class="my-credits">My credits</button>

    <credits-info slot="tooltip" class="column" let:close>
      <header class="row v-center justify body-1">
        My credits

        <button class="close btn" on:click={close}>
          <Svg id="close" w="10" />
        </button>
      </header>

      <main class="column c-waterloo">
        <user class="row v-center justify mrg-xl mrg--b">
          <user-plan class="row v-center gap-s">
            Plan:
            <AccountStatus currentUser={$currentUser$} />
          </user-plan>

          <value> 140K Credits </value>
        </user>

        <div class="row gap-xxxl">
          <span>
            Used:
            <value>139 000</value>
          </span>

          <span class="mrg-a mrg--l">
            Credits left:
            <value>1000</value>
          </span>
        </div>

        <credits-progress class="row mrg-m mrg--b mrg--t">
          <credits-used style="width:70%" />
        </credits-progress>

        Next renewal on Nov 23, 2023

        <div class="mrg-xxl mrg--t">
          <a href="/pricing" class="btn-1 btn--orange mrg-s mrg--t">Upgrade for more credits</a>
        </div>
      </main>
    </credits-info>
  </Tooltip>
</credits>

<style>
  credits {
    background: var(--porcelain);
    margin: 0 -24px;
    padding: 6px 24px;
    position: sticky;
    bottom: 0;
  }

  .my-credits {
    padding: 0 10px;
  }

  header {
    padding: 7px 16px;
    border-bottom: 1px solid var(--porcelain);
  }

  main {
    padding: 16px;
  }

  user {
    background: var(--athens);
    border-radius: 6px;
    padding: 8px;
  }

  value {
    font: 500 var(--body-2);
    color: var(--black);
  }

  credits-progress {
    background: var(--porcelain);
  }

  credits-used {
    background: var(--green);
  }

  credits-progress,
  credits-used {
    height: 4px;
    border-radius: 4px;
    overflow: hidden;
  }
</style>
