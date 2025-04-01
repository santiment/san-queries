<script lang="ts">
  import { trackEvent, Tracker } from 'san-webkit-next/analytics'
  import { Dashboard } from '$lib-next/dashboard'

  let { data } = $props()

  $effect(() => {
    const id = data.apiDashboard?.id ?? null

    const eventTimer = window.setTimeout(() => {
      trackEvent('dashboard_page_view_timer_45s', { id, source: 'dashboard' }, [Tracker.GA])

      trackEvent('page', {
        id,
        action: 'view_timer',
        type: '45s',
        source: 'dashboard',
      })
    }, 1000 * 45)

    function onPageScroll() {
      const scrollHeight = document.body.scrollHeight - window.innerHeight

      if (window.scrollY / scrollHeight >= 0.8) {
        window.removeEventListener('scroll', onPageScroll)

        trackEvent('dashboard_scroll_80%', { id, source: 'dashboard' }, [Tracker.GA])
        trackEvent('page', {
          id,
          action: 'scroll',
          type: '80%',
          source: 'dashboard',
        })
      }
    }

    window.addEventListener('scroll', onPageScroll)

    return () => {
      clearTimeout(eventTimer)
      window.removeEventListener('scroll', onPageScroll)
    }
  })
</script>

{#key data.apiDashboard?.id}
  <Dashboard readonly={true} apiDashboard={data.apiDashboard} cache={data.dashboardDataCache}
  ></Dashboard>
{/key}
