import { z } from 'zod'

type Filter<T extends string, V> = { type: T; value: App.Empty<V> }

export type NumberFilterType = Filter<
  'number',
  { min?: App.Empty<number>; max?: App.Empty<number> }
>
export type SearchFilterType = Filter<'search', string>

export type FilterType = NumberFilterType | SearchFilterType

export const NumberFilterScheme = z.object({
  type: z.literal('number').default('number'),
  value: z
    .object({
      max: z.number().optional(),
      min: z.number().optional(),
    })
    .default({}),
})
export type NumberFilterSchemeType = z.infer<typeof NumberFilterScheme>

export const SearchFilterScheme = z.object({
  type: z.literal('search'),
  value: z.string().trim().optional(),
})
export type SearchFilterSchemeType = z.infer<typeof SearchFilterScheme>

export const FilterScheme = z.discriminatedUnion('type', [SearchFilterScheme, NumberFilterScheme])
export type FilterSchemeType = z.infer<typeof FilterScheme>

export function checkIsEmptyFilter({ type, value }: FilterSchemeType) {
  switch (type) {
    case 'search':
      return !value
    case 'number':
      return !Number.isFinite(value.min) && !Number.isFinite(value.max)
  }
}
