import type { TDashboardKey } from '$lib-next/dashboard/types'
import { catchError, from, mergeMap, of } from 'rxjs'
import { compressData } from '$lib/utils/compress'
import { mutateStoreDashboardQueryExecution, type TDashboardSqlData } from '../api/cache'

export const createStoreDashboardSqlCache$ = (
  dashboardId: TDashboardKey,
  sqlData: Partial<TDashboardSqlData>,
) =>
  from(compressData(sqlData)).pipe(
    mergeMap((compressedData) =>
      mutateStoreDashboardQueryExecution()({
        compressedData,
        dashboardId,
        dashboardQueryMappingId: sqlData.dashboardQueryMappingId!,
      }),
    ),
    catchError(() => of(null)),
  )
