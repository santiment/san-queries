import type { ComponentType } from 'svelte'
import type { Props as SvgProps } from 'san-webkit/lib/ui/Svg/svelte'

type StepValue<T> = T extends { validate(this: { value: infer V }): any } ? V : never

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace App {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Alerts {
      type CategorySchema<T = unknown> = {
        title: string
        description: string
        icon: SvgProps['id']
        steps: Step<any, any>[]

        /** Generating API schema for alert creation */
        getSchema(alert: T): {
          type: string
          target: unknown
          selector?: unknown
        }

        suggestTitle?: (alert: any) => string
        suggestDescription?: (alert: any) => string

        /** Used for determening if the alert recieved from api belongs to the specific category */
        matchApiAlert(alert: App.Alerts.ApiAlert): boolean
      }

      type Category = CategorySchema & {
        alert: import('./categories').CategoryAlert & {
          id?: number | null
          operation?: Record<string, any> | null
          valid: boolean
        }
      }

      type StepSchema<T = undefined, K = undefined> = {
        new: () => T
        validate(this: Step<T>): void

        title: string
        description: string
        label?: string

        Step?: ComponentType
        StepValue?: ComponentType

        parseApiAlert: (alert: App.Alerts.ApiAlert, data: K) => T
      } & (K extends undefined
        ? {
            getData?: () => Promise<K>
          }
        : {
            getData: () => Promise<K>
          })

      type Step<T = undefined, K = undefined> = StepSchema<T, K> & {
        valid?: boolean
        completed?: boolean
        next?: NextStep
      } & (T extends undefined ? { value?: T } : { value: T })

      type NextStep = null | {
        label: string
        onClick?: () => unknown
      }

      type Conditions = import('./MetricsAndConditions/conditions').Conditions

      type Metric = { key: string; label: string }

      type CategoryAlert = UnionToIntersection<
        StepValue<ReturnType<typeof import('./categories').normalizeSteps>[number]>
      >
    }
  }
}

export {}
