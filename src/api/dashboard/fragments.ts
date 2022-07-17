export const DASHBOARD_FRAGMENT = `
  id
  title:name
  description
  isPublic
  user {
    id
    username
    email
    avatarUrl
  }
  panels {
    name
    description
    type
    sql {
      query
      parameters
    }
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
  type
  sql {
    query
    parameters
  }
`
