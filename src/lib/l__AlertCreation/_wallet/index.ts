import { getAddressInfrastructure } from 'san-webkit/lib/utils/address'
import { queryWalletAssets } from '../api'
import ChooseWalletStep from './ChooseWalletStep.svelte'
import { describe } from '../MetricsAndConditions/utils'
import { METRICS_AND_CONDITIONS_STEP } from '../MetricsAndConditions'

const STEPS = [
  {
    new: () => ({ target: { address: '' } }),
    validate() {
      this.valid = !!this.value.target?.infrastructure
    },

    title: 'Select Wallet & Event',
    description: 'You can choose any wallet',

    Step: ChooseWalletStep,

    getData: (alert: any) => {
      const { target, selector } = alert.settings
      if (!target?.address) return Promise.resolve([])

      return queryWalletAssets(target.address, selector.infrastructure)
    },

    parseApiAlert(alert: any, data: any[]) {
      const { settings } = alert

      return {
        ...METRICS_AND_CONDITIONS_STEP.parseApiAlert(alert),
        type: settings.type,
        target: {
          address: settings.target.address,
          infrastructure: settings.selector.infrastructure,
          asset: data.find((asset) => asset.slug === settings.selector.slug),
          use_combined_balance: settings.target.use_combined_balance,
        },
      }
    },
  } as App.Alerts.StepSchema<any, any>,
]

export const Category = {
  title: 'Wallet address',
  description: 'Create an alert for the specific asset inside a certain wallet',
  icon: 'wallet',
  steps: STEPS,

  suggestTitle(alert) {
    const { type, target, conditions } = alert

    if (type === 'wallet_movement') {
      if (Array.isArray(target.address)) {
        return `Combined balance ${describe(null, conditions)}`
      }
      return `${target.asset.name} ${describe(null, conditions)}`
    }

    if (type === 'wallet_usd_valuation') {
      return `Balance ${describe(null, conditions)}`
    }

    return 'Existed assets exit the wallet or new asset enters the wallet with non-zero balance'
  },

  suggestDescription() {
    return ''
  },

  getSchema({ type, target }) {
    return {
      type,
      target: { address: target.address, use_combined_balance: target.use_combined_balance },
      selector: {
        slug: target.asset?.slug,
        infrastructure: getAddressInfrastructure(target.address || ''),
      },
    }
  },

  matchApiAlert: ({ settings: { type } }) =>
    ['wallet_movement', 'wallet_usd_valuation', 'wallet_assets_held'].includes(type),
} as const satisfies App.Alerts.CategorySchema<Alert>

type Alert = {
  type: 'wallet_movement' | 'wallet_usd_valuation' | 'wallet_assets_held'
  target: {
    address: string
    use_combined_balance?: boolean
    asset?: { slug: string }
  }
}
