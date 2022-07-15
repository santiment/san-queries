import { getContext, setContext } from 'svelte'
import type { Dashboard$ } from '@/stores/dashboard'

export const APP_CTX = 'APP_CTX'

export type Context = {
  dashboard$: Dashboard$
}

export const setAppContext = (ctx: Context) => setContext(APP_CTX, ctx)
export const getAppContext = () => getContext(APP_CTX) as Context
