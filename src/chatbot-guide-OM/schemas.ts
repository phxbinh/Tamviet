import { z } from "zod";

export const parsedGuideSchema = z.object({
title: z.string(),

category: z.string().optional(),

version: z.string().optional(),

overview: z.string(),

procedures: z.array(
z.object({
title: z.string(),

  description: z.string().optional(),
  steps: z.array(
    z.object({
      order: z.number(),
      content: z.string(),
    })
  ),
})

),

parameters: z.array(
z.object({
equipment: z.string().optional(),

  parameterName: z.string(),
  rangeRaw: z.string().optional(),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
  unit: z.string().optional(),
  frequency: z.string().optional(),
  description: z.string().optional(),
})

),

healthChecks: z.array(
z.object({
statusType: z.enum([
"healthy",
"problem",
]),

  label: z.string(),
  value: z.string(),
})

),

troubleshooting: z.array(
z.object({
problem: z.string(),

  causes: z.array(z.string()),
  solutions: z.array(z.string()),
})

),
});

export type ParsedGuideSchema = z.infer;