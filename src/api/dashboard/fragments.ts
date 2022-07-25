export const SHORT_DASHBOARD_FRAGMENT = `
  id
  user {
    id
    username
    email
    avatarUrl
  }
  commentsCount
  votedAt
  votes { 
    userVotes:currentUserVotes
    totalVoters
    totalVotes
  }
`

export const PANEL_FRAGMENT = `
  id
  name
  description
  settings
  sql {
    query
    parameters
  }
`

export const DASHBOARD_FRAGMENT = `
  ${SHORT_DASHBOARD_FRAGMENT}
  title:name
  description
  isPublic
  panels {
    ${PANEL_FRAGMENT}
  }
`
