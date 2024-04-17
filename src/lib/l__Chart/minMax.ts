export function getMinMax(axesMetrics: string[], data: any[][]) {
  const MinMax = {} as Record<string, { min: number; max: number; lastValue?: number }>

  data.forEach((row) => {
    axesMetrics.forEach((key) => {
      const value = row[key]

      if (!MinMax[key]) {
        MinMax[key] = {
          min: Infinity,
          max: -Infinity,
          lastValue: undefined as undefined | number,
        }
      }

      const minMax = MinMax[key]

      if (value < minMax.min) minMax.min = value
      if (value > minMax.max) minMax.max = value
      if (Number.isFinite(value)) minMax.lastValue = value
    })
  })

  return MinMax
}
