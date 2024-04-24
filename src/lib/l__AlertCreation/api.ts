import type { AlertSchemas } from './categories'

import { Universal, mutate, query } from 'san-webkit/lib/api'
import { getMetricKeyMinInterval } from 'san-studio/lib/api/metrics/restrictions'
import { DUPLEX_OP, Operation } from './MetricsAndConditions/conditions'
import { filterValidSources, mapSourcesToChannel } from './NotificationsAndPrivacy/utils'

type AlertMutation = SAN.API.Query<'savedAlert', { trigger: { id: number } }>

function getOperationValues(operation: NonNullable<App.Alerts.Category['alert']['operation']>) {
  if (operation.type === Operation.some_of) {
    const [percent_up, percent_down] = operation.values
    return [{ percent_up }, { percent_down }]
  }

  return DUPLEX_OP.has(operation.type) ? operation.values : operation.values[0]
}

export async function mutateSaveAlert(alert: App.Alerts.Category['alert'], schema: AlertSchemas) {
  const { id, title, description, conditions, channel, cooldown, isRepeating, isPublic } = alert

  const { time, operation } = conditions || {}

  const settings = {
    operation: operation && {
      [operation.type.key]: getOperationValues(operation),
    },
    ...schema,
    channel: mapSourcesToChannel(channel, filterValidSources(channel)),
    time_window: time ? time.value + time.type.key : '',
  }

  if (settings.type.includes('metric_signal')) {
    const { metric } = settings as any
    if (metric) {
      const minInterval = await getMetricKeyMinInterval(metric)
      settings.type = minInterval === '1d' ? 'daily_metric_signal' : 'metric_signal'
    }
  }

  return mutate<AlertMutation>(
    `mutation($settings: json!, $isPublic: Boolean, $isRepeating: Boolean, $cooldown: String, $title: String!, $description: String) {
  savedAlert:${id ? 'updateTrigger(id:' + id : 'createTrigger('}
    settings: $settings
    isPublic: $isPublic
    isRepeating: $isRepeating
    cooldown: $cooldown
    title: $title
    description: $description
  ) {
    trigger {
      id
    }
  }
}`,
    {
      variables: {
        title,
        description,
        isRepeating,
        isPublic,
        settings: JSON.stringify(settings),
        cooldown: cooldown.value + cooldown.type.key,
      },
    },
  ).then(({ savedAlert }) => savedAlert.trigger)
}

export const ALERT_COMMON_FRAGMENT = `
    id
    title
    description
    isPublic
    cooldown
    settings
    isActive
    isRepeating
    isFrozen
`

const USER_ALERTS_QUERY = `{
  currentUser {
    alerts:triggers {
      ${ALERT_COMMON_FRAGMENT}
    }
    settings {
      alertsPerDayLimit
    }
  }
}`

type UserAlertsQuery = SAN.API.Query<
  'currentUser',
  null | {
    alerts: App.Alerts.Alert[]
    settings: { alertsPerDayLimit?: Record<string, number> }
  }
>

export const queryUserAlerts = Universal((query) => () => query<UserAlertsQuery>(USER_ALERTS_QUERY))

// -------------------------

export const USER_FEATURED_ALERTS_QUERY = `{
    alerts: featuredUserTriggers {
        userId
        alert: trigger {
            ${ALERT_COMMON_FRAGMENT}
        }
    }
}
`

type FeaturedUserAlertsQuery = SAN.API.Query<
  'alerts',
  | null
  | {
      userId: string
      alert: App.Alerts.Alert
    }[]
>

export const queryUserFeaturedAlerts = Universal(
  (query) => () => query<FeaturedUserAlertsQuery>(USER_FEATURED_ALERTS_QUERY),
)

const queryProjects = (slugs: string[]) =>
  query<SAN.API.Query<'allProjects', { slug: string; name: string; ticker: string }[]>>(
    `query($slugs: [String]){
  allProjects(selector:{baseProjects:[{slugs:$slugs}]}) {
    slug
    name
    ticker
	}
}`,
    { variables: { slugs } },
  ).then((data) => data.allProjects)

const ASSETS_ON_ADDRESS_QUERY = (address: string, infrastructure: string) => `{
  assetsHeldByAddress(
    selector: {address: "${address}", infrastructure: "${infrastructure}"}
    showAssetsWithZeroBalance: true
  ) {
    slug
    balance
    balanceUsd
  }
}`

type Asset = {
  slug: string
  balance: number
  balanceUsd: number
}
type AssetsHeldByAddressQuery = SAN.API.Query<'assetsHeldByAddress', Asset[]>

// TODO: Ask backend to add project/asset field to assetsHeldByAddress [@vanguard | 24 Apr, 2023]
const sorter = (a: Asset, b: Asset) => b.balanceUsd - a.balanceUsd
const precacher =
  () =>
  ({ assetsHeldByAddress: assets }: any) => {
    assets.sort(sorter)

    let total = 0
    for (let i = assets.length - 1; i > -1; i--) {
      const asset = assets[i]
      if (asset.balanceUsd) total += asset.balanceUsd
      else asset.balanceUsd = 0
    }

    const SlugProject = {} as Record<string, Asset>
    for (let i = assets.length - 1; i > -1; i--) {
      const asset = assets[i]
      const { slug, balanceUsd, balance } = asset
      asset.allocation = balanceUsd / total || 0
      asset.priceUsd = balanceUsd / balance || 0
      SlugProject[slug] = asset
    }

    return queryProjects(Object.keys(SlugProject)).then((projects) => {
      for (let i = projects.length - 1; i > -1; i--) {
        const project = projects[i]
        Object.assign(SlugProject[project.slug], project)
      }
      return assets
    })
  }

export type WalletAsset = {
  balance: 0
  balanceUsd: 0
  slug: string
  allocation: 0
  priceUsd: number
  name: string
  ticker: string
}

export const queryWalletAssets = Universal(
  (query) => (address: string, infrastructure: string) =>
    query<AssetsHeldByAddressQuery>(ASSETS_ON_ADDRESS_QUERY(address, infrastructure), {
      precacher: precacher as any,
      // }).then((data) => data.assetsHeldByAddress),
    }) as unknown as Promise<WalletAsset[]>,
)
