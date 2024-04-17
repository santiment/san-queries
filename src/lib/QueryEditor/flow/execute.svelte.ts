import { Subject, catchError, delay, exhaustMap, filter, map, of, pipe, switchMap, tap } from 'rxjs'

import { useObserveFnCall } from '$lib/ui/utils/state.svelte'
import { queryRunRawSqlQuery, type TRawSqlData } from '../api'
import { useExecuteButtonCtx } from '../ExecuteButton.svelte'
import { useExecutionStatsCtx } from '../ExecutionStats'

export type TExecutionData$ = Subject<{ queryId: number; data: App.SqlData }>

export function useQueryExecuteFlow(
  onResult: (data: TRawSqlData) => void,
  onError: (error: any) => void,
) {
  const executionData$: TExecutionData$ = new Subject()

  const executeButtonCtx = useExecuteButtonCtx()
  const executionStatsCtx = useExecutionStatsCtx()

  const onExecuteClick = useObserveFnCall<App.QueryEditor>(() =>
    pipe(
      filter((queryEditor): queryEditor is App.QueryEditor & { id: number } => !!queryEditor.id),
      exhaustMap((queryEditor) =>
        of(queryEditor).pipe(
          tap(() => executeButtonCtx.emit.loading()),
          switchMap((queryEditor: App.QueryEditor) =>
            queryRunRawSqlQuery()({
              sql: queryEditor.sql,
              parameters: queryEditor.apiParameters,
            }).pipe(
              tap((data) => (data.queryId = queryEditor.id)),
              tap((data) => executionData$.next({ queryId: queryEditor.id!, data })),
              tap((data) => executionStatsCtx.emit.query(data.clickhouseQueryId)),
              delay(500),
              tap(() => executeButtonCtx.emit.default()),
              tap(onResult),

              catchError((error) =>
                of(null).pipe(
                  tap(() => onError(error)),
                  tap(() => executeButtonCtx.emit.default()),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  )

  return {
    executionData$,
    onExecuteClick,
  }
}
