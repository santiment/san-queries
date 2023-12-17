export function getScales(axesMetrics: string[], MinMax: any) {
  const scales = {
    x: {
      ticks: {
        maxTicksLimit: 10,
      },
    },
  } as Record<string, any>

  axesMetrics.forEach((key) => {
    const { min, max } = MinMax[key]
    scales[key] = {
      position: 'right',
      min,
      max,
      ticks: {
        stepSize: (max - min) / 5,
      },
    }
  })

  return scales
}
