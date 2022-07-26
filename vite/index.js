import 'webkit/styles/main.css'
import { parse } from 'webkit/utils/url'
import Dialogs from 'webkit/ui/Dialog/Dialogs.svelte'
import FeatureWalkthrough from 'webkit/ui/FeatureWalkthrough/svelte'
import Notifications from 'webkit/ui/Notifications'
import { startResponsiveController } from 'webkit/responsive'
import App from '../src/index.svelte'

startResponsiveController()

const { shared } = parse(window.location.search)
const panel = shared ? JSON.parse(shared) : undefined
history.pushState(null, '', '/')

new App({
  target: document.querySelector('#app'),
  props: {
    dashboard: panel && { panels: [panel] },
  },
})

new Dialogs({ target: document.body })

new FeatureWalkthrough({ target: document.body })

new Notifications({ target: document.body })

window.toggleNight = () => document.body.classList.toggle('night-mode')
