import { createGotoWithBrowserData } from '$lib/utils'

export const gotoDashboardPage = createGotoWithBrowserData<{ apiDashboard: App.ApiDashboard }>()
