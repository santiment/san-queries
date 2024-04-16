import { CURRENT_USER_FRAGMENT } from 'san-webkit/lib/stores/user'
import { Fetcher } from '../index'

export const QUERIES_CREDITS = `
 queriesExecutionsInfo {
    creditsAvailalbeMonth
    creditsRemainingMonth
    creditsSpentMonth
  }
`

type TQueriesCredits = {
  queriesExecutionsInfo: {
    creditsAvailalbeMonth: number
    creditsRemainingMonth: number
    creditsSpentMonth: number
  }
}

export const queryCurrentUser = Fetcher(
  () => `{
    currentUser {
      ${CURRENT_USER_FRAGMENT}
      ${QUERIES_CREDITS}
    }
  }`,
  (data: {
    currentUser:
      | null
      | ({
          id: number | string
          username?: string
        } & TQueriesCredits)
  }) => data.currentUser,
)

export const queryUserCredits = Fetcher(
  () => `{
    currentUser {
      ${QUERIES_CREDITS}
    }
  }`,
  (data: { currentUser: null | TQueriesCredits }) => data.currentUser,
)

declare global {
  namespace App {
    interface CurrentUser extends SAN.CurrentUser {
      queriesExecutionsInfo: {
        creditsAvailalbeMonth: number
        creditsRemainingMonth: number
        creditsSpentMonth: number
      }
    }
  }
}
