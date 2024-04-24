import type { FrequencyValue } from './frequencies'

export const Source = {
  EMAIL: 'email',
  TELEGRAM: 'telegram',
  TELEGRAM_CHANNEL: 'telegram_channel',
  WEBHOOK: 'webhook',
  PUSH: 'push',
} as const

export type SourceType = (typeof Source)[keyof typeof Source]

export type Value = {
  cooldown: { value: number; type: FrequencyValue }
  isPublic: boolean
  isRepeating: boolean

  channel: Partial<{
    [Source.EMAIL]: boolean
    [Source.TELEGRAM]: boolean
    [Source.TELEGRAM_CHANNEL]: string
    [Source.WEBHOOK]: string
  }>
}
export type Step = App.Alerts.Step<Value>
