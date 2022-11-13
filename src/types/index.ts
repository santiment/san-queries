export enum PanelType {
  TABLE = 'TABLE',
  TEXT = 'TEXT',
  CHART = 'CHART',
  PIE_CHART = 'PIE_CHART',
}
export const PanelData = [
  {
    type: PanelType.TABLE,
    label: 'Table',
  },
  {
    type: PanelType.TEXT,
    label: 'Text',
  },
  {
    type: PanelType.CHART,
    label: 'Chart',
  },
  {
    type: PanelType.PIE_CHART,
    label: 'Pie Chart',
  },
]

export enum ParameterType {
  Text = 'Text',
  Number = 'Number',
}
