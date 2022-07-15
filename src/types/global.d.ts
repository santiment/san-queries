/// <reference types="svelte" />
/// <reference types="vite/client" />
/// <reference types="san-webkit" />

declare module '*.png' {
  const value: string
  export = value
}

declare namespace NodeJS {
  interface Process {
    browser: boolean
    GQL_SERVER_URL: string
  }
}

declare namespace SAN {
  declare namespace Queries {
    type PanelType = import('./index').PanelType

    type SQL = {
      parameters: string | undefined
      query: string
    }

    type SQLResult = {
      columns: string[]

      /** Each row has a tuple, which size is equal to the amount of columns */
      rows: (string | number)[][]
    }

    type DashboardPanel = {
      id: string
      dashboardId: number
      name: string
      description: string
      sql: SQL
      type: PanelType
    }

    type Dashboard = {
      id: number
      name: string
      description: string
      isPublic: boolean
      user: SAN.Author
      panels: DashboardPanel[]
      insertedAt: string
      updatedAt: string
      commentsCount: number
      votedAt: string
      votes: { currentUserVotes: number; totalVoters: number; totalVotes: number }
    }
  }
}
