<script lang="ts">
  import { useStore } from 'svelte-runes'
  import { filter, pipe, switchMap, tap } from 'rxjs'
  import { getDateFormats, getTodaysEnd } from 'san-webkit/lib/utils/dates'
  import AccountStatus from 'san-webkit/lib/ui/AccountStatus.svelte'
  import { getCurrentUser$Ctx } from 'san-webkit/lib/stores/user'
  import { Preloader } from 'san-webkit/lib/utils/fn'
  import Popover from '$lib/ui/Popover'
  import Button from '$lib/ui/Button.svelte'
  import { queryUserCredits } from '$lib/api/user'
  import { useObserveFnCall } from '$lib/ui/utils/state.svelte'
  import { useCustomerCtx } from 'san-webkit-next/ctx/customer'

  const { currentUser } = useCustomerCtx()

  let {
    creditsRemainingMonth = 0,
    creditsAvailalbeMonth,
    creditsSpentMonth,
  } = $derived(currentUser.$$?.queriesExecutionsInfo || {})

  const updateCreditsData = useObserveFnCall(() =>
    pipe(
      filter(() => !!currentUser.$$),
      switchMap(() =>
        queryUserCredits()().pipe(
          filter((data) => !!data),
          tap((data) => (currentUser.$$ = Object.assign(currentUser.$$, data))),
        ),
      ),
    ),
  )

  const preloadUserCredits = Preloader(updateCreditsData)

  function getNextMonthDate() {
    const date = getTodaysEnd()
    date.setMonth(date.getMonth() + 1)
    date.setDate(1)

    const { MMM, DD, YYYY } = getDateFormats(date)
    return `${MMM} ${DD}, ${YYYY}`
  }
</script>

{#if currentUser.$$}
  <section class="sticky bottom-0 -mx-6 flex justify-between bg-porcelain px-6 py-1.5">
    Credits left: {creditsRemainingMonth}

    <Popover class="z-10 p-0">
      {#snippet children({ trigger, action })}
        <Button class="hover:text-green" {action} actionArgs={trigger}>
          <span use:preloadUserCredits>My credits</span>
        </Button>
      {/snippet}

      {#snippet tooltip({ close })}
        <credits-info class="flex flex-col">
          <header class="flex items-center justify-between border-b px-4 py-2 text-lg">
            My credits

            <Button icon="close" iconSize="10" action={close}></Button>
          </header>

          <main class="flex flex-col p-4 text-waterloo">
            <user class="mb-6 flex items-center justify-between gap-6 rounded-md bg-athens p-2">
              <user-plan class="flex items-center gap-2">
                Plan:
                <AccountStatus currentUser={currentUser.$$} />
              </user-plan>

              <value>
                {creditsAvailalbeMonth} Credits
              </value>
            </user>

            <div class="flex justify-between gap-8">
              <span>
                Credits left:
                <value class="text-black">{creditsRemainingMonth}</value>
              </span>

              <span>
                Used:
                <value class="text-black">{creditsSpentMonth}</value>
              </span>
            </div>

            <credits-progress class="my-3 flex bg-porcelain">
              <credits-used
                class="bg-green"
                style="width:{(100 * creditsRemainingMonth) / creditsAvailalbeMonth}70%"
              />
            </credits-progress>

            Next renewal on {getNextMonthDate()}

            <div class="mt-6">
              <Button
                variant="fill"
                href="https://app.santiment.net/pricing"
                data-source="my_credits"
                data-type="upgrade_for_more_credits"
                class="mt-2 inline-flex bg-orange hover:bg-orange-hover"
              >
                Upgrade for more credits
              </Button>
            </div>
          </main>
        </credits-info>
      {/snippet}
    </Popover>
  </section>
{/if}

<style lang="postcss">
  value {
    @apply text-base font-medium text-black;
  }

  credits-progress,
  credits-used {
    @apply h-1 overflow-hidden rounded;
  }
</style>
