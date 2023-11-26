import { getContext, setContext } from 'svelte'

const CTX = 'authCtx'

export function setAuthCtx(onMetamaskClick: () => unknown) {
  return setContext(CTX, { onMetamaskClick })
}

export type ICurrentUserCtx = ReturnType<typeof setAuthCtx>

export const getAuthCtx = () => getContext(CTX) as ICurrentUserCtx
