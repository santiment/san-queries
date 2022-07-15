export const DASHBOARD_FRAGMENT = `
  id
  name
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
    currentUserVotes
    totalVoters
    totalVotes
  }
`
