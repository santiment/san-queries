import 'webkit/styles/main.css'
import Dialogs from 'webkit/ui/Dialog/Dialogs.svelte'
import FeatureWalkthrough from 'webkit/ui/FeatureWalkthrough/svelte'
import { startResponsiveController } from 'webkit/responsive'
import App from '../src/index.svelte'

startResponsiveController()

new App({
  target: document.querySelector('#app'),
})

new Dialogs({ target: document.body })

new FeatureWalkthrough({ target: document.body })

window.toggleNight = () => document.body.classList.toggle('night-mode')
