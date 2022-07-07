import 'webkit/styles/main.css'
import Dialogs from 'webkit/ui/Dialog/Dialogs.svelte'
import { startResponsiveController } from 'webkit/responsive'
import App from '../src/index.svelte'

startResponsiveController()

new App({
  target: document.querySelector('#app'),
})

new Dialogs({
  target: document.querySelector('#app'),
})

window.toggleNight = () => document.body.classList.toggle('night-mode')
