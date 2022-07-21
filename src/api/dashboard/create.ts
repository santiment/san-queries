import { mutate } from 'webkit/api'

const CREATE_DASHBOARD_MUTATION = `
  mutation($title:String!, $description:String, $isPublic:Boolean, $settings:json) {
    createDashboard(name:$title, description:$description, isPublic:$isPublic, tempJson:$settings) {
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
    }
  }`

type CreateDashboardQuery = SAN.API.Query<'createDashboard', SAN.Queries.Dashboard>

export type CreateDashboardVariables = {
  title: string
  description?: string
  isPublic?: boolean
}

const createDashboardAccessor = ({ createDashboard }) => createDashboard
export const mutateCreateDashboard = (variables: CreateDashboardVariables) =>
  mutate<CreateDashboardQuery>(CREATE_DASHBOARD_MUTATION, {
    variables,
  }).then(createDashboardAccessor) as Promise<SAN.Queries.Dashboard>

// ---------------------------------------

const CREATE_DASHBOARD_PANEL_MUTATION = `
  mutation($dashboardId:Int!, $sql:PanelSqlInputObject!, $name:String!, $description:String, $settings:json) {
    createDashboardPanel(dashboardId:$dashboardId, panel:{sql:$sql, name:$name, description:$description, settings:$settings}) {
      id
    }
  }`

type CreatePanelQuery = SAN.API.Query<'createDashboardPanel', SAN.Queries.DashboardPanel>

export type CreatePanelVariables = {
  dashboardId: number
  name: string
  description?: string
  sql: SAN.Queries.SQL
  settings: any
}

const createDashboardPanelAccessor = ({ createDashboardPanel }) => createDashboardPanel
export const mutateCreateDashboardPanel = (variables: CreatePanelVariables) =>
  mutate<CreatePanelQuery>(CREATE_DASHBOARD_PANEL_MUTATION, {
    variables,
  }).then(createDashboardPanelAccessor) as Promise<SAN.Queries.DashboardPanel>

// ---------------------------------------
