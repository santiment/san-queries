export function getAlertsRestrictions(
  alerts: App.Alerts.Alert[],
  isPro: boolean,
  isProPlus: boolean,
): any {
  const maxAmount = isProPlus ? Infinity : isPro ? 20 : 3
  const { length } = alerts || []

  return {
    maxAmount,
    currentAmount: length,
    shouldHideRestrictionMessage: isProPlus || length < maxAmount,
  }
}
