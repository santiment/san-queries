import 'webkit/styles/main.css'
import Dialogs from 'webkit/ui/Dialog/Dialogs.svelte'
import FeatureWalkthrough from 'webkit/ui/FeatureWalkthrough/svelte'
import Notifications from 'webkit/ui/Notifications'
import { startResponsiveController } from 'webkit/responsive'
import { getIdFromSEOLink } from 'webkit/utils/url'
import App from '../src/index.svelte'
import { parseSharedUrl } from '../src/sharing/url'
import { queryDashboard } from '../src/api/dashboard'

startResponsiveController()

const [dashboardRoute, panelRoute] = window.location.pathname.slice(1).split('/')
const id = getIdFromSEOLink(dashboardRoute)

if (Number.isFinite(id)) {
  queryDashboard(id).then((dashboard) => {
    start(dashboard, panelRoute)
  })
} else {
  const { panels, selectedPanelId } = parseSharedUrl(window.location.search)
  start(panels && { panels }, selectedPanelId)
}

function start(dashboard, selectedPanelId) {
  new App({
    target: document.querySelector('#app'),
    props: {
      dashboard,
      selectedPanelId,
    },
  })

  new Dialogs({ target: document.body })

  new FeatureWalkthrough({ target: document.body })

  new Notifications({ target: document.body })
}

window.toggleNight = () => document.body.classList.toggle('night-mode')
