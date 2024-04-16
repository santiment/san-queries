import { CURRENT_USER_FRAGMENT } from 'san-webkit/lib/stores/user'
import { mutate } from 'san-webkit/lib/api'
// import { CURRENT_USER_FRAGMENT } from '.'
//

// type Mutation = SAN.API.Query<'verify', { user: App.CurrentUser }>
type Mutation = SAN.API.Query<'verify', { user: any }>

export const mutateVerifyEmail = (email: string, token: string) =>
  mutate<Mutation>(
    `mutation {
  verify:emailLoginVerify(email:"${email}", token:"${token}") {
    user { 
      ${CURRENT_USER_FRAGMENT}
    }
  }
}`,
  ).then(({ verify }) => verify.user)
