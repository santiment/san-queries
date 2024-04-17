import { filter, from, map, mergeMap, of, switchMap, tap } from 'rxjs'
import { useObserve, type SS } from 'svelte-runes'
import { compressData } from '$lib/utils/compress'
import { queryGetCachedQueryExecutions } from '$lib/QueryEditor/api'
import { useExecutionStatsCtx } from '$lib/QueryEditor/ExecutionStats'
import { mutateStoreQueryExecution } from './api'
import type { TExecutionData$ } from '../execute.svelte'

export function useStoreSqlDataCache(executionData$: TExecutionData$) {
  useObserve(() =>
    executionData$.pipe(
      switchMap(({ queryId, data }) =>
        from(compressData(data).then((compressedData) => ({ queryId, compressedData }))).pipe(
          mergeMap(({ queryId, compressedData }) =>
            mutateStoreQueryExecution()(queryId, compressedData),
          ),
        ),
      ),
    ),
  )
}

export function useGetSqlDataCache(
  queryId: undefined | number,
  onResult: (data: (App.SqlData & { clickhouseQueryId: string }) | undefined) => void,
) {
  const executionStatsCtx = useExecutionStatsCtx()

  useObserve(() =>
    of(queryId).pipe(
      filter((id): id is number => !!id),
      tap((v) => console.log({ v })),
      switchMap((id) =>
        queryGetCachedQueryExecutions()(id).pipe(
          map((cache) => (cache[0] ? cache[0].result : undefined)),
          tap(onResult),
          tap((data) => data && executionStatsCtx.emit.query(data.clickhouseQueryId)),
        ),
      ),
    ),
  )
}
