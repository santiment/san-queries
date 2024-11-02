import { createCtx } from 'san-webkit-next/utils'
import { useCustomerCtx } from 'san-webkit-next/ctx/customer'

type TAuthor = null | {
  id: string | number
  username?: null | string
  avatarUrl?: null | string
}

export const useDashboardCtx = createCtx(
  'queries_useDashboardCtx',
  (apiDashboard: undefined | null | App.ApiDashboard, isReadonly = true) => {
    const _apiDashboard: Partial<NonNullable<typeof apiDashboard>> = apiDashboard || {}

    const { currentUser } = useCustomerCtx.get()

    const author: TAuthor = _apiDashboard.user || currentUser.$$
    const isCurrentUserAuthor = author?.id === currentUser.$$?.id

    const state = $state({
      name: _apiDashboard.name || '',
      description: _apiDashboard.description || '',
      isPublic: _apiDashboard.isPublic ?? false,
      commentsCount: _apiDashboard.commentsCount ?? 0,
      votes: _apiDashboard.votes || { totalVotes: 0, userVotes: 0 },
    })

    return {
      dashboard: {
        id: _apiDashboard.id,

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
    }
  },
)
