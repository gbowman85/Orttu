import { v } from 'convex/values'
import { Id } from './_generated/dataModel';


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

// Convex schema for data types
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

// Type definition for data types
export type DataType = 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'array' | 'object' | 'file' | 'image' | 'any'

export const InputType = v.union(
  v.literal("text"),
  v.literal("textarea"),
  v.literal("select"),
  v.literal("checkbox"),
  v.literal("radio"),
  v.literal("date"),
  v.literal("datetime"),
  v.literal("number"),
  v.literal("switch"),
  v.literal("file"),
  v.literal("image")
)

// Type definition for input types
export type InputType = 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'datetime' | 'number' | 'switch' | 'file' | 'image'

// Convex schema for parameter values
export const ParameterValueSchema = v.union(
  v.string(),
  v.number(),
  v.boolean(),
  v.array(v.string()),
  v.object({}),
  v.any()
)

// Type definition for parameter values
export type ParameterValue = string | number | boolean | string[] | { [key: string]: any } | any

// Convex schema for parameters
export const ParameterSchema = v.object({
  parameterKey: v.string(),
  title: v.string(),
  description: v.string(),
  dataType: DataTypeSchema,
  inputType: v.optional(InputType),
  required: v.boolean(),
  showIf: v.optional(v.object({
    parameterKey: v.string(),
    operator: v.union(
      v.literal("equals"),
      v.literal("notEquals"),
      v.literal("greaterThan"),
      v.literal("lessThan"),
      v.literal("contains"),
      v.literal("notContains")
    ),
    value: v.union(
      v.string(),
      v.number(),
      v.boolean(),
      v.array(v.string())
    )
  })),
  default: v.optional(v.any()),
  validation: v.optional(v.object({
    min: v.optional(v.number()),
    max: v.optional(v.number()),
    minLength: v.optional(v.number()),
    maxLength: v.optional(v.number()),
    pattern: v.optional(v.string()),
    allowedValues: v.optional(v.array(v.string())),
    allowedValueLabels: v.optional(v.array(v.string()))
  }))
})

// Type definition for parameters
export type Parameter = {
  parameterKey: string
  title: string
  description: string
  dataType: DataType
  inputType?: InputType
  required: boolean
  showIf?: {
    parameterKey: string
    operator: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'contains' | 'notContains'
    value: string | number | boolean | string[]
  }
  default?: any
  validation?: {
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
    pattern?: string
    allowedValues?: string[]
    allowedValueLabels?: string[]
  }
} 

// Convex schema for outputs
export const OutputSchema = v.object({
    outputKey: v.string(),
    outputDataType: DataTypeSchema,
    outputTitle: v.string(),
    outputDescription: v.string()
})

// Type definition for outputs
export type Output = {
  outputKey: string
  outputDataType: DataType
  outputTitle: string
  outputDescription: string
}

// Convex schema for action steps
export const ActionStepReference = v.object({
  actionStepId: v.id("action_steps"),
  children: v.optional(v.record(v.string(), v.array(v.id("action_steps"))))
})

// Type definition for action steps
export type ActionStepReferenceType = {
  actionStepId: Id<"action_steps">
  children?: Record<string, Id<"action_steps">[]>
}