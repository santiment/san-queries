import type { AlertSchemas } from './categories'

import { notifications$ } from 'san-webkit/lib/ui/Notifications'
import { errorify } from '$lib/utils/promise'
import { mutateSaveAlert } from './api'

// TODO: Add alias for $routes [@vanguard | 27 Mar, 2023]

export async function startSaveAlertFlow(
  category: App.Alerts.Category,
  alert: App.Alerts.Category['alert'],
) {
  const [, error] = await errorify(
    mutateSaveAlert(alert, category.getSchema(alert) as AlertSchemas),
  )

  if (error) {
    return notifications$.show({ type: 'error', title: error.message })
  }

  return notifications$.show({ type: 'success', title: 'Alert was succesfully created' })
}
