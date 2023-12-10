import { Universal } from 'webkit/api'
import { CURRENT_USER_FRAGMENT } from 'webkit/stores/user'

export const queryCurrentUser = Universal(
  (query) => () =>
    query<SAN.API.Query<'currentUser', SAN.CurrentUser | null>>(`{
    currentUser {
      ${CURRENT_USER_FRAGMENT}
      queriesExecutionsInfo {
        creditsAvailalbeMonth
        creditsRemainingMonth
        creditsSpentMonth
      }
    }
  }`),
)

export const refetchUserCredits = Universal(
  (query) => () =>
    query<SAN.API.Query<'currentUser', SAN.CurrentUser | null>>(
      `{
    currentUser {
      queriesExecutionsInfo {
        creditsAvailalbeMonth
        creditsRemainingMonth
        creditsSpentMonth
      }
    }
  }`,
      { cacheTime: 5 },
    ),
)

declare global {
  namespace App {
    interface CurrentUser extends SAN.CurrentUser {
      // type Cu = {
      queriesExecutionsInfo: {
        creditsAvailalbeMonth: number
        creditsRemainingMonth: number
        creditsSpentMonth: number
      }
    }
  }
}
