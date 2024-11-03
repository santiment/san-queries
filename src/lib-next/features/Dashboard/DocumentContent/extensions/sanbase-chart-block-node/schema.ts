export const SANBASE_CHART_BLOCK_NODE = {
  name: 'sanbase-chart',

  isDataWidget: true,

  localParameters: {
    from: 'utc_now-60d' as string,
    to: 'utc_now' as string,
    slug: 'bitcoin' as string,
  },
} as const
