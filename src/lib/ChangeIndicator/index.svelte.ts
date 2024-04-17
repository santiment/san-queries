import { createCtx } from '$lib/ctx'
import { Subject } from 'rxjs'

export const useChangeIndicatorCtx = createCtx('useChangeIndicatorCtx', () => {
  const subject = new Subject()

  return {
    emit: {
      changed: () => subject.next(undefined),
    },

    onChange$: subject,
  }
})
