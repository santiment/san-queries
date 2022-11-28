/// <reference types="svelte" />
/// <reference types="vite/client" />
/// <reference types="san-webkit" />

declare module '*.png' {
  const value: string
  export = value
}

declare module '*.json' {
  const value: any
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
    type ParameterType = import('./index').ParameterType

    type ParameterValue = number | string
    type SQL = {
      parameters: { [parameter: string]: ParameterValue }
      query: string
    }

    type SQLResult = {
      columns: string[]

      /** Each row has a tuple, which size is equal to the amount of columns */
      rows: (string | number)[][]
    }

    type Column = {
      title: string
      formatterId: number
      isHidden?: boolean
      chartStyle?: any
    }

    type PanelSettings = {
      type: PanelType
      columns: any[]
      xAxisKey?: number
      parameters?: { type: ParameterType }[]
      layout?: number[]
    }

    type PanelParameter = { key: string; value: ParameterValue; type: ParameterType }

    type Panel = {
      id: string
      dashboardId: number
      name: string
      description: string
      sql: { query: string; parameters: PanelParameter[] }
      settings: PanelSettings
    }

    type DashboardPanel = {
      submetricOf: any
      id: string
      dashboardId: number
      name: string
      description: string
      sql: SQL
      settings: PanelSettings
    }

    type Dashboard = {
      id: number
      title: string
      description: string
      isPublic: boolean
      user?: SAN.Author
      panels: DashboardPanel[]
      // insertedAt: string
      // updatedAt: string
      commentsCount: number
      votedAt: string
      votes?: { userVotes: number; totalVoters: number; totalVotes: number }

      removedPanels: DashboardPanel[]
    }
  }
}
