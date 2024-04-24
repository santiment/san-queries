import type { Value } from './types'

export function filterValidSources(channel: Value['channel']) {
  return Object.keys(channel).filter((key) => channel[key as keyof typeof channel])
}

export function mapSourcesToChannel(channel: Value['channel'], sources: string[]) {
  return sources.map((source) => {
    const value = channel[source as keyof typeof channel]
    return value === true ? source : { [source]: value }
  })
}
