import { goto } from '$app/navigation'
import { BROWSER } from 'esm-env'
import { groupBy, mergeMap, pipe, type OperatorFunction } from 'rxjs'
import { getDateFormats, getTimeFormats } from 'san-webkit/lib/utils/dates'
import { getSEOLinkFromIdAndTitle } from 'san-webkit/lib/utils/url'

export function getPlaceholderName() {
  const now = new Date()
  const { DD, MMM, YYYY } = getDateFormats(now)
  const { HH, mm } = getTimeFormats(now)

  return `${MMM} ${DD}, ${YYYY}, ${HH}:${mm}`
}

export function createGotoWithBrowserData<T>() {
  const fn = (href: string, data: T) => {
    if (BROWSER) window.GOTO_INVALIDATE_DATA = data
    goto(href)
  }

  fn.get = () => {
    if (BROWSER) {
      const data = window.GOTO_INVALIDATE_DATA as T
      delete window.GOTO_INVALIDATE_DATA
      return data
    }

    return
  }

  return fn
}

declare global {
  interface Window {
    GOTO_INVALIDATE_DATA?: undefined | unknown
  }
}

export function replaceSeoLink(path: string, id: number | string, name?: string) {
  window.history.replaceState(history.state, '', path + getSEOLinkFromIdAndTitle(id, name))
}

export const pipeGroupBy = <T>(groupFn: (data: T) => any, operator: OperatorFunction<T, any>) =>
  pipe(
    groupBy(groupFn),
    mergeMap((grouped) => grouped.pipe(operator)),
  )
