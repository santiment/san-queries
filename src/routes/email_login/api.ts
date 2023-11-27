import { CURRENT_USER_FRAGMENT } from 'webkit/stores/user'
import { mutate } from 'webkit/api'
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
