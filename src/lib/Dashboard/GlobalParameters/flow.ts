import type { TUnwrappedChange, TUnwrappedChanges } from './utils'

import { useObserveFnCall } from '$lib/ui/utils/state.svelte'
import {
  catchError,
  concat,
  concatAll,
  exhaustMap,
  filter,
  from,
  map,
  mergeMap,
  of,
  pipe,
  tap,
} from 'rxjs'
import {
  mutateAddDashboardGlobalParameter,
  mutateAddDashboardGlobalParameterOverride,
  mutateDeleteDashboardGlobalParameter,
  mutateDeleteDashboardGlobalParameterOverride,
  mutateUpdateDashboardGlobalParameter,
} from './api'
import { pipeGroupBy } from '$lib/utils'

export const createAddGlobalParameterOverrides$ = (
  dashboardId: number,
  dashboardParameterKey: string,
  added: TUnwrappedChange,
) =>
  added.length
    ? from(added).pipe(
        map(([dashboardQueryMappingId, queryParameterKey]) =>
          mutateAddDashboardGlobalParameterOverride()({
            dashboardId,
            dashboardParameterKey,
            dashboardQueryMappingId,
            queryParameterKey,
          }).pipe(catchError(() => of(null))),
        ),
        concatAll(),
      )
    : of(null)

export const createDeleteGlobalParameterOverrides$ = (
  dashboardId: number,
  dashboardParameterKey: string,
  deleted: TUnwrappedChange,
) =>
  from(deleted).pipe(
    mergeMap(([dashboardQueryMappingId]) =>
      mutateDeleteDashboardGlobalParameterOverride()({
        dashboardId,
        dashboardParameterKey,
        dashboardQueryMappingId,
      }),
    ),
  )

export function useCreateGlobalParameterFlow() {
  const createGlobalParameter = useObserveFnCall<{
    dashboard: { id: number }
    parameter: { key: string; value: number | string }
    overrides: TUnwrappedChanges
    onComplete: () => void
    type?: 'string' | 'stringList'
  }>(() =>
    exhaustMap(({ dashboard, parameter, overrides, onComplete, type = 'string' }) =>
      concat(
        mutateAddDashboardGlobalParameter()({
          dashboardId: dashboard.id,
          key: parameter.key,
          value: { [type]: parameter.value },
        }),
        createAddGlobalParameterOverrides$(dashboard.id, parameter.key, overrides.added),
        of(null).pipe(tap(onComplete)),
      ),
    ),
  )

  return { createGlobalParameter }
}

export function useUpdateGlobalParameterFlow() {
  const updateGlobalParameter = useObserveFnCall<{
    dashboard: { id: number }
    oldKey: string
    parameter: { key: string; value: number | string }
    overrides: TUnwrappedChanges
    onComplete?: () => void
    type?: 'string' | 'stringList'
  }>(() =>
    exhaustMap(({ dashboard, oldKey, parameter, overrides, onComplete, type = 'string' }) =>
      concat(
        mutateUpdateDashboardGlobalParameter()({
          dashboardId: dashboard.id,
          key: oldKey,
          newKey: parameter.key,
          newValue: { [type]: parameter.value },
        }),

        createDeleteGlobalParameterOverrides$(dashboard.id, parameter.key, overrides.deleted),
        createAddGlobalParameterOverrides$(dashboard.id, parameter.key, overrides.added),

        of(null).pipe(tap(onComplete)),
      ),
    ),
  )

  return { updateGlobalParameter }
}

export function useDeleteGlobalParameterFlow() {
  const deleteGlobalParameter = useObserveFnCall<{
    dashboardId: number
    parameter: { key: string; value: number | string }
    onComplete?: () => void
  }>(() =>
    pipeGroupBy(
      ({ parameter }) => parameter.key,
      exhaustMap(({ dashboardId, parameter, onComplete }) =>
        mutateDeleteDashboardGlobalParameter()({
          dashboardId,
          key: parameter.key,
        }).pipe(tap(onComplete)),
      ),
    ),
  )

  return { deleteGlobalParameter }
}

export function useLinkGlobalParameterFlow() {
  const linkGlobalParameter = useObserveFnCall<{
    dashboard: { id: number }
    dashboardQueryMappingId: string
    queryParameterKey: string
    oldParameterKey?: string
    newParameterKey?: string

    onComplete: () => void
  }>(() =>
    pipe(
      filter(({ dashboard }) => !!dashboard.id),
      filter(({ oldParameterKey, newParameterKey }) => oldParameterKey !== newParameterKey),
      exhaustMap(
        ({
          dashboard,
          dashboardQueryMappingId,
          oldParameterKey,
          newParameterKey,
          queryParameterKey,
          onComplete,
        }) =>
          concat(
            // Order matters - delete should be first, then adding new link
            oldParameterKey
              ? mutateDeleteDashboardGlobalParameterOverride()({
                  dashboardId: dashboard.id,
                  dashboardParameterKey: oldParameterKey,
                  dashboardQueryMappingId,
                })
              : of(null),

            newParameterKey
              ? mutateAddDashboardGlobalParameterOverride()({
                  dashboardId: dashboard.id,
                  dashboardParameterKey: newParameterKey,
                  dashboardQueryMappingId,
                  queryParameterKey,
                })
              : of(null),

            of(null).pipe(tap(onComplete)),
          ),
      ),
    ),
  )

  return { linkGlobalParameter }
}
