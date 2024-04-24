import { query } from 'san-webkit/lib/api'
import { Metric as M } from 'san-studio/lib/metrics'
import { Subitems } from 'san-studio/lib/metrics/selector/subitems'
import {
  HOLDER_DISTRIBUTION_ABSOLUTE_METRICS,
  HOLDER_DISTRIBUTION_BALANCE_PERCENT_METRICS,
  HOLDER_DISTRIBUTION_BALANCE_ABSOLUTE_METRICS,
} from 'san-studio/lib/metrics/_onchain/holderDistributions'
import { MetricCategory } from 'san-studio/lib/metrics/graph'

export const ALERT_DAILY_METRICS = [
  M.bitmex_perpetual_basis,
  M.bitmex_perpetual_basis_ratio,
  M.bitmex_perpetual_funding_rate,
  M.bitmex_perpetual_open_interest,
  M.bitmex_perpetual_open_value,
]
  .concat(
    HOLDER_DISTRIBUTION_ABSOLUTE_METRICS.map((metric) => ({
      ...metric,
      label: `Supply Distribution Absolute ${metric.label}`,
    })),

    HOLDER_DISTRIBUTION_BALANCE_PERCENT_METRICS.map((metric) => ({
      ...metric,
      label: `Supply Distribution Percent ${metric.label}`,
    })),

    HOLDER_DISTRIBUTION_BALANCE_ABSOLUTE_METRICS.map((metric) => ({
      ...metric,
      label: `Supply Distribution by Balance of Addresses ${metric.label}`,
    })),
  )
  .concat([
    M.exchange_balance,
    M.exchange_inflow,
    M.exchange_outflow,
    M.active_deposits,
    M.deposit_transactions,
    M.withdrawal_transactions,

    M.network_growth,
    M.daily_active_addresses,
    M.transaction_volume,

    M.whale_transaction_count_1m_usd_to_inf,
    M.whale_transaction_count_100k_usd_to_inf,

    M.age_consumed,

    M.nvt,
    M.mvrv_usd_intraday,
    ...(Subitems as Record<string, any[]>)[M.mvrv_usd_intraday.key],

    M.network_profit_loss,

    M.mean_age,
    M.mean_dollar_invested_age,
  ])

const FINANCIAL = [
  M.price_usd,
  M.volume_usd,
  M.price_btc,
  M.price_eth,
  M.marketcap_usd,
  M.rsi_4h,
  M.rsi_1d,
  M.rsi_7d,
]

const SOCIAL = [
  M.social_volume_total,
  ...['reddit', 'telegram', 'twitter'].map((source) => ({
    ...M.social_volume_total,
    key: `social_volume_${source}`,
    label: `Social Volume (${source})`,
  })),

  M.social_dominance_total,
  ...['reddit', 'telegram', 'twitter'].map((source) => ({
    ...M.social_dominance_total,
    key: `social_dominance_${source}`,
    label: `Social Dominance (${source})`,
  })),
]

const DEVELOPMENT: Studio.Metric[] = [
  M.dev_activity,
  {
    category: MetricCategory.Development,
    key: 'github_activity',
    label: 'Github Activity',
    node: 'line',
  },
]

export const ALERT_METRICS = FINANCIAL.concat(SOCIAL)
  .concat(DEVELOPMENT)
  .concat(ALERT_DAILY_METRICS)

export function checkIsUsdMetric(metric: any) {
  return new Set([M.price_usd, M.marketcap_usd]).has(metric)
}

export function queryAvailableMetrics(slug: string) {
  return query<any>(`{
    projectBySlug(slug:"${slug}") { availableMetrics }
  }`).then(({ projectBySlug }) => projectBySlug.availableMetrics)
}
