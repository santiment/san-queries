import { getContext, setContext } from 'svelte'

export function createCtx<CtxName extends string, CtxCreator extends (...args: any[]) => any>(
  CTX: CtxName,
  creator: CtxCreator,
) {
  type CtxValue = ReturnType<CtxCreator>

  return (...args: Parameters<CtxCreator>) => {
    const ctx = getContext(CTX) as CtxValue
    if (ctx) return ctx

    return setContext(CTX, creator(...args)) as CtxValue
  }
}

export function Emitter<T extends Record<string, number | string>>(emit: any, events: T) {
  return Object.entries(events).reduce(
    (acc, [key, event]) =>
      Object.assign(acc, {
        [key]: () => emit(event),
      }),
    {},
  ) as { [K in keyof T]: () => void }
}
