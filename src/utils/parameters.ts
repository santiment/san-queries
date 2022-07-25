export const getParametersMap = (
  parameters: SAN.Queries.PanelParameter[],
): SAN.Queries.DashboardPanel['sql']['parameters'] =>
  parameters.reduce((acc, { key, value }) => Object.assign(acc, { [key]: value }), {})
