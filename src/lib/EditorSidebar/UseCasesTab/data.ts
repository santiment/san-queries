export const DASHBOARDS = [
  {
    id: 842,
    name: 'How to get started 1: Santiment Queries Data Exploration',
  },
  {
    id: 843,
    name: 'How to get started 2: Useful Tables to explore',
  },
  {
    id: 845,
    name: 'How to get started 3: Useful Functionalities: Parameters',
  },
  {
    id: 958,
    name: 'Simple Query examples',
  },
].map((v: any) => {
  v.type = 'dashboard'
  return v
})

export const NFTS = [
  {
    id: 517,
    name: 'Check the number of unique wallets that have owned an NFT last 7 days.',
  },
  {
    id: 518,
    name: 'Check the platforms ordered by sales for last 7 days',
  },
  {
    id: 519,
    name: 'Sales for platform for last 5 months split by month',
  },
  {
    id: 520,
    name: 'Top 10 buyers ordered by completed purchases count for last 5 days',
  },
  {
    id: 521,
    name: 'Top 10 sellers ordered by completed purchases count for last 5 days',
  },
  {
    id: 522,
    name: 'Unique assets for the last 7 days',
  },
  {
    id: 523,
    name: 'Unique assets for the last 7 days for a single platform( or seller/buyer) with summed amounts',
  },
].map((v: any) => {
  v.type = 'query'
  return v
})

export const DEX_TABLES = [
  {
    id: 524,
    name: 'Check my current BTC balance using btc_balances',
  },
  {
    id: 525,
    name: 'Check my current BTC balance in dollar amount',
  },
].map((v: any) => {
  v.type = 'query'
  return v
})
