import { mutate } from 'webkit/api'
import type { CreateDashboardVariables, CreatePanelVariables } from './create'
import { PANEL_FRAGMENT, SHORT_DASHBOARD_FRAGMENT } from './fragments'

const UPDATE_DASHBOARD_MUTATION = `
  mutation($id:Int!, $title:String!, $description:String, $isPublic:Boolean) {
    updateDashboard(id:$id, name:$title, description:$description, isPublic:$isPublic) {
      ${SHORT_DASHBOARD_FRAGMENT}
    }
  }`

type UpdateDashboardQuery = SAN.API.Query<'updateDashboard', SAN.Queries.Dashboard>

type updateDashboardVariables = CreateDashboardVariables & {
  id: number
}

const updateDashboardAccessor = ({ updateDashboard }) => updateDashboard
export const mutateUpdateDashboard = (variables: updateDashboardVariables) =>
  mutate<UpdateDashboardQuery>(UPDATE_DASHBOARD_MUTATION, {
    variables,
  }).then(updateDashboardAccessor) as Promise<SAN.Queries.Dashboard>

// ---------------------------------------

const UPDATE_DASHBOARD_PANEL_MUTATION = `
  mutation($dashboardId:Int!, $panelId:String!, $sql:PanelSqlInputObject!, $name:String!, $description:String, $settings:json) {
    updateDashboardPanel(dashboardId:$dashboardId, panelId:$panelId, panel:{sql:$sql, name:$name, description:$description, settings:$settings}) {
      ${PANEL_FRAGMENT}
    }
  }`

type UpdatePanelQuery = SAN.API.Query<'updateDashboardPanel', SAN.Queries.DashboardPanel>

type UpdateDashboardPanelVariables = CreatePanelVariables & {
  panelId: string
}

const updateDashboardPanelAccessor = ({ updateDashboardPanel }) => updateDashboardPanel
export const mutateUpdateDashboardPanel = (variables: UpdateDashboardPanelVariables) =>
  mutate<UpdatePanelQuery>(UPDATE_DASHBOARD_PANEL_MUTATION, {
    variables,
  }).then(updateDashboardPanelAccessor) as Promise<SAN.Queries.DashboardPanel>

// ---------------------------------------
