import { CURRENT_USER_FRAGMENT } from 'webkit/stores/user'
import { mutate } from 'webkit/api'
// import { CURRENT_USER_FRAGMENT } from '.'
//

const VERIFY_EMAIL_MUTATION = (email: string, token: string) => `
mutation {
  verify:emailLoginVerify(email:"${email}", token:"${token}") {
    user { 
      ${CURRENT_USER_FRAGMENT}
    }
  }
}`

// type Mutation = SAN.API.Query<'verify', { user: App.CurrentUser }>
type Mutation = SAN.API.Query<'verify', { user: any }>

const verificationAccessor = ({ verify }: Mutation) => verify.user

export const mutateVerifyEmail = (email: string, token: string) =>
  mutate<Mutation>(VERIFY_EMAIL_MUTATION(email, token)).then(verificationAccessor)
