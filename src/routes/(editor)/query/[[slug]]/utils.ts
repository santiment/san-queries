import { createGotoWithBrowserData } from '$lib/utils'

export const gotoQueryPage = createGotoWithBrowserData<{ apiQuery: App.ApiQuery }>()
