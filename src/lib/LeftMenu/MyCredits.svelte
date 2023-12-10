<script lang="ts">
  import Tooltip from 'webkit/ui/Tooltip'
  import Svg from 'webkit/ui/Svg/svelte'
  import AccountStatus from 'webkit/ui/AccountStatus.svelte'
  import { getCurrentUser$Ctx } from 'webkit/stores/user'
  import { getDateFormats, getTodaysEnd } from 'webkit/utils/dates'
  import { refetchUserCredits } from '$lib/api/user'
  import { Preloader } from 'san-webkit/lib/utils/fn'
  import { EventRefreshUserCredits$ } from '$routes/(editor)/query/events'

  const { currentUser$ } = getCurrentUser$Ctx()
  const preloadUserCredits = Preloader(updateCreditsData)

  $: currentUser = $currentUser$ as null | App.CurrentUser

  $: ({ creditsRemainingMonth, creditsAvailalbeMonth, creditsSpentMonth } =
    currentUser?.queriesExecutionsInfo || ({} as App.CurrentUser['queriesExecutionsInfo']))

  function getNextMonthDate() {
    const date = getTodaysEnd()
    date.setMonth(date.getMonth() + 1)
    date.setDate(1)

    const { MMM, DD, YYYY } = getDateFormats(date)
    return `${MMM} ${DD}, ${YYYY}`
  }

  function updateCreditsData() {
    if (!currentUser) return

    refetchUserCredits().then((data) => {
      if (data.currentUser) {
        Object.assign(currentUser as any, data.currentUser)
        currentUser = currentUser
      }
    })
  }

  const eventRefreshUserCredits = EventRefreshUserCredits$(updateCreditsData)
  $eventRefreshUserCredits
</script>

{#if currentUser}
  <credits class="row justify">
    Credits left: {creditsRemainingMonth}

    <Tooltip on="click" let:trigger clickaway>
      <button use:trigger class="my-credits" use:preloadUserCredits>My credits</button>

      <credits-info slot="tooltip" class="column" let:close>
        <header class="row v-center justify body-1">
          My credits

          <button class="close btn" on:click={close}>
            <Svg id="close" w="10" />
          </button>
        </header>

        <main class="column c-waterloo">
          <user class="row v-center justify gap-xl mrg-xl mrg--b">
            <user-plan class="row v-center gap-s">
              Plan:
              <AccountStatus currentUser={$currentUser$} />
            </user-plan>

            <value>
              {creditsAvailalbeMonth} Credits
            </value>
          </user>

          <div class="row gap-xxxl">
            <span>
              Credits left:
              <value>{creditsRemainingMonth}</value>
            </span>

            <span class="mrg-a mrg--l">
              Used:
              <value>{creditsSpentMonth}</value>
            </span>
          </div>

          <credits-progress class="row mrg-m mrg--b mrg--t">
            <credits-used
              style="width:{(100 * creditsRemainingMonth) / creditsAvailalbeMonth}70%"
            />
          </credits-progress>

          Next renewal on {getNextMonthDate()}

          <div class="mrg-xxl mrg--t">
            <a href="/pricing" class="btn-1 btn--orange mrg-s mrg--t">Upgrade for more credits</a>
          </div>
        </main>
      </credits-info>
    </Tooltip>
  </credits>
{/if}

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
