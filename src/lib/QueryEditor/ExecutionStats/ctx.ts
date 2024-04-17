import { Subject, catchError, filter, map, of, share, switchMap } from 'rxjs'
import { createCtx } from '$lib/ctx'
import { queryGetClickhouseQueryExecutionStats } from './api'

export const useExecutionStatsCtx = createCtx('useExecutionStatsCtx', () => {
  const subjet = new Subject<undefined | string>()

  return {
    emit: {
      query: (clickhouseQueryId: string) => subjet.next(clickhouseQueryId),
    },

    stats$: subjet.pipe(
      filter((id): id is string => !!id),
      switchMap((id) =>
        queryGetClickhouseQueryExecutionStats()(id).pipe(
          map((stats) => ({ ...stats, id })),
          catchError(() => of(undefined)),
        ),
      ),
      share(),
    ),
  }
})
