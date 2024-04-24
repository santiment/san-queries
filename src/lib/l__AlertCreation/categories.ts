import type { UnionToIntersection } from 'type-fest'

import { Category as Asset } from './_asset'
import { Category as Wallet } from './_wallet'
import { NOTIFICATIONS_AND_PRIVACY_STEP } from './NotificationsAndPrivacy'
import { NAME_AND_DESCRIPTION_STEP } from './NameAndDescription'

export const AlertCategory = {
  Asset,
  Wallet,
} satisfies Record<string, App.Alerts.CategorySchema>

export const CATEGORIES = Object.values(AlertCategory)

type CategoriesType = typeof CATEGORIES

export type CategoryType = CategoriesType[number]
export type SelectedCategory = null | ReturnType<typeof normalizeCategory>
export type AlertSchemas = ReturnType<CategoryType['getSchema']>
export type AlertTargets = AlertSchemas['target']

type StepValue<T> = T extends { validate(this: { value: infer V }): any } ? V : never

export type CategoryAlert = UnionToIntersection<
  StepValue<ReturnType<typeof normalizeSteps>[number]>
>

export function normalizeSteps(steps: CategoryType['steps']) {
  return [...steps, NOTIFICATIONS_AND_PRIVACY_STEP, NAME_AND_DESCRIPTION_STEP].map((step) => ({
    ...step,
  })) // NOTE: Alert's steps will be mutated, hence global template should be affected by it [@vanguard | 11 Mar, 2023]
}

export function normalizeCategory(category: CategoryType) {
  return {
    alert: {} as App.Alerts.Category['alert'],
    ...category,
    steps: normalizeSteps(category.steps) as App.Alerts.Step[],
  }
}
