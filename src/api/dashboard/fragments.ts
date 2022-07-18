export const DASHBOARD_FRAGMENT = `
  id
  title:name
  description
  isPublic
  settings:tempJson
  user {
    id
    username
    email
    avatarUrl
  }
  panels {
    name
    description
    settings
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
  settings
  sql {
    query
    parameters
  }
`
