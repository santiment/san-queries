import type { Editor } from '@tiptap/core'
import { ss } from 'svelte-runes'
import { createCtx } from 'san-webkit-next/utils'
import { useCustomerCtx } from 'san-webkit-next/ctx/customer'
import { parseDashboardDocument } from '../parse'
import type { TApiDashboard, TAuthor } from '../types'

export const useDashboardCtx = createCtx(
  'queries_useDashboardCtx',
  (apiDashboard: undefined | null | TApiDashboard<any>, isReadonly: boolean = true) => {
    const _apiDashboard: Partial<NonNullable<typeof apiDashboard>> = apiDashboard || {
      settings: {},
    }

    const { currentUser } = useCustomerCtx.get()

    const author: null | TAuthor = _apiDashboard.user || currentUser.$$
    const isCurrentUserAuthor = author?.id === currentUser.$$?.id

    const state = $state({
      id: _apiDashboard.id,
      name: _apiDashboard.name || '',
      description: _apiDashboard.description || '',
      isPublic: _apiDashboard.isPublic ?? false,
      commentsCount: _apiDashboard.commentsCount ?? 0,
      votes: _apiDashboard.votes || { totalVotes: 0, userVotes: 0 },
    })

    return {
      dashboard: {
        state: {
          get $$() {
            return state
          },
        },

        author,
        isCurrentUserAuthor,

        isReadonly,
        isEditable: !isReadonly,

        apiDashboard,
      },

      dashboardDocument: parseDashboardDocument(_apiDashboard),

      documentEditor: ss<null | Editor>(null),
    }
  },
)
