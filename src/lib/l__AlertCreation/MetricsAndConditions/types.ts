export type Value = {
  metric: null | App.Alerts.Metric
  conditions: App.Alerts.Conditions
}
export type StepType = App.Alerts.Step<Value>
