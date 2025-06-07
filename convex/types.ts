import { v } from 'convex/values'

//*
//  TypeScript types
//*

// Type definition for parameters

export type DataType = 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'array' | 'object' | 'file' | 'image' | 'any'

export type Parameter = {
  parameterKey: string
  title: string
  description: string
  type: DataType
  required: boolean
  default?: string
  validation?: {
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
    pattern?: string
    allowedValues?: string[]
  }
} 



//*
//  Convex schema types
//*

// Enums for status and types
export const WorkflowStatus = v.union(
  v.literal("running"),
  v.literal("completed"),
  v.literal("failed"),
  v.literal("cancelled")
);

export const StepStatus = v.union(
  v.literal("pending"),
  v.literal("running"),
  v.literal("completed"),
  v.literal("failed"),
  v.literal("skipped")
);

export const DataTypeSchema = v.union(
  v.literal("string"),
  v.literal("number"),
  v.literal("boolean"),
  v.literal("date"),
  v.literal("datetime"),
  v.literal("array"),
  v.literal("object"),
  v.literal("file"),
  v.literal("image"),
  v.literal("any")
);

// Define the possible value types for parameters
export const ParameterValue = v.union(
  v.string(),
  v.number(),
  v.boolean(),
  v.array(v.string()),
  v.object({}),
  v.any()
)

// Convex schema for parameters
export const ParameterSchema = v.object({
  parameterKey: v.string(),
  title: v.string(),
  description: v.string(),
  type: DataTypeSchema,
  required: v.boolean(),
  default: v.optional(v.string()),
  validation: v.optional(v.object({
    min: v.optional(v.number()),
    max: v.optional(v.number()),
    minLength: v.optional(v.number()),
    maxLength: v.optional(v.number()),
    pattern: v.optional(v.string()),
    allowedValues: v.optional(v.array(v.string()))
  }))
})

