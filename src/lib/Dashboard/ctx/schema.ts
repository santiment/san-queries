import { z } from 'zod'

export const DashboardSettingsSchema_v1 = z.object({
  layout: z
    .array(
      z.object({
        id: z.string(),
        xywh: z.tuple([z.number(), z.number(), z.number(), z.number()]),
      }),
    )
    .default([]),
})

export type TDashboardSettings = z.infer<typeof DashboardSettingsSchema_v1>
