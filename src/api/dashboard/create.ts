import { mutate } from 'webkit/api'
import { DASHBOARD_FRAGMENT } from './fragments'

const CREATE_DASHBOARD_MUTATION = `
  mutation($title:String!, $description:String, $isPublic:Boolean) {
    createDashboard(name:$title, description:$description, isPublic:$isPublic) {
      ${DASHBOARD_FRAGMENT}
    }
  }`

type CreateDashboardQuery = SAN.API.Query<'createDashboard', SAN.Queries.Dashboard>

type CreateDashboardVariables = {
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
  mutation($dashboardId:Int!, $sql:PanelSqlInputObject!, $name:String!, $description:String, $type:PanelType) {
    createDashboardPanel(dashboardId:$dashboardId, panel:{sql:$sql, name:$name, description:$description, type:$type}) {
      name
      description
      type
      sql {
        query
        parameters
      }
    }
  }`

type Query = SAN.API.Query<'createDashboardPanel', SAN.Queries.DashboardPanel>

type CreateDashboardPanelVariables = {
  dashboardId: number
  name: string
  description: string
  sql: SAN.Queries.SQL
  type: SAN.Queries.PanelType
}

const createDashboardPanelAccessor = ({ createDashboardPanel }) => createDashboardPanel
export const mutateCreateDashboardPanel = (variables: CreateDashboardPanelVariables) =>
  mutate<Query>(CREATE_DASHBOARD_PANEL_MUTATION, {
    variables,
  }).then(createDashboardPanelAccessor) as Promise<SAN.Queries.DashboardPanel>

// ---------------------------------------
