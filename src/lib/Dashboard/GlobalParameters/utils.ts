import { untrack } from 'svelte'
import { Map as Map$ } from 'svelte/reactivity'
import { SEPARATOR, createWidgetIdParameterKey } from '../ctx/parameters'

export type TUnwrappedChanges = ReturnType<OverridesDiff['unwrap']>
export type TUnwrappedChange = TUnwrappedChanges['added']

export class OverridesDiff {
  public added = new Set<string>()
  public deleted = new Set<string>()

  public value: Map$<string, string>

  constructor(overrides: Map<string, string>) {
    this.value = untrack(() => new Map$(overrides))
  }

  public set(queryWidgetId: string, parameterKey: string) {
    const key = createWidgetIdParameterKey(queryWidgetId, parameterKey)

    const oldParameterKey = untrack(() => this.value.get(queryWidgetId))
    if (oldParameterKey) {
      this.delete(queryWidgetId, oldParameterKey)
    }

    this.value.set(queryWidgetId, parameterKey)

    if (this.deleted.has(key)) {
      this.deleted.delete(key)
    } else {
      this.added.add(key)
    }
  }

  public get(queryWidgetId: string) {
    return this.value.get(queryWidgetId)
  }

  public delete(queryWidgetId: string, parameterKey: string) {
    const key = createWidgetIdParameterKey(queryWidgetId, parameterKey)

    this.value.delete(queryWidgetId)

    if (this.added.has(key)) {
      this.added.delete(key)
    } else {
      this.deleted.add(key)
    }
  }

  public unwrap() {
    const split = (key: string) => key.split(SEPARATOR) as [string, string]

    return {
      added: [...this.added].map(split),
      deleted: [...this.deleted].map(split),
    }
  }
}
