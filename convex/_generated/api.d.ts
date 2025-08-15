/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as action_functions__action_loader from "../action_functions/_action_loader.js";
import type * as action_functions__action_registry from "../action_functions/_action_registry.js";
import type * as action_functions_pipedream from "../action_functions/pipedream.js";
import type * as action_functions_variables from "../action_functions/variables.js";
import type * as action_functions_workflow_control from "../action_functions/workflow_control.js";
import type * as auth from "../auth.js";
import type * as crons from "../crons.js";
import type * as data_functions_action_categories from "../data_functions/action_categories.js";
import type * as data_functions_action_definitions from "../data_functions/action_definitions.js";
import type * as data_functions_scheduled_workflows from "../data_functions/scheduled_workflows.js";
import type * as data_functions_services from "../data_functions/services.js";
import type * as data_functions_trigger_categories from "../data_functions/trigger_categories.js";
import type * as data_functions_trigger_definitions from "../data_functions/trigger_definitions.js";
import type * as data_functions_users from "../data_functions/users.js";
import type * as data_functions_workflow_config from "../data_functions/workflow_config.js";
import type * as data_functions_workflow_runs from "../data_functions/workflow_runs.js";
import type * as data_functions_workflow_steps from "../data_functions/workflow_steps.js";
import type * as data_functions_workflows from "../data_functions/workflows.js";
import type * as http from "../http.js";
import type * as sync_functions from "../sync_functions.js";
import type * as trigger_functions__trigger_loader from "../trigger_functions/_trigger_loader.js";
import type * as trigger_functions__trigger_registry from "../trigger_functions/_trigger_registry.js";
import type * as trigger_functions_manual from "../trigger_functions/manual.js";
import type * as trigger_functions_schedule from "../trigger_functions/schedule.js";
import type * as types from "../types.js";
import type * as workflow_execution from "../workflow_execution.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "action_functions/_action_loader": typeof action_functions__action_loader;
  "action_functions/_action_registry": typeof action_functions__action_registry;
  "action_functions/pipedream": typeof action_functions_pipedream;
  "action_functions/variables": typeof action_functions_variables;
  "action_functions/workflow_control": typeof action_functions_workflow_control;
  auth: typeof auth;
  crons: typeof crons;
  "data_functions/action_categories": typeof data_functions_action_categories;
  "data_functions/action_definitions": typeof data_functions_action_definitions;
  "data_functions/scheduled_workflows": typeof data_functions_scheduled_workflows;
  "data_functions/services": typeof data_functions_services;
  "data_functions/trigger_categories": typeof data_functions_trigger_categories;
  "data_functions/trigger_definitions": typeof data_functions_trigger_definitions;
  "data_functions/users": typeof data_functions_users;
  "data_functions/workflow_config": typeof data_functions_workflow_config;
  "data_functions/workflow_runs": typeof data_functions_workflow_runs;
  "data_functions/workflow_steps": typeof data_functions_workflow_steps;
  "data_functions/workflows": typeof data_functions_workflows;
  http: typeof http;
  sync_functions: typeof sync_functions;
  "trigger_functions/_trigger_loader": typeof trigger_functions__trigger_loader;
  "trigger_functions/_trigger_registry": typeof trigger_functions__trigger_registry;
  "trigger_functions/manual": typeof trigger_functions_manual;
  "trigger_functions/schedule": typeof trigger_functions_schedule;
  types: typeof types;
  workflow_execution: typeof workflow_execution;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {
  workflow: {
    journal: {
      load: FunctionReference<
        "query",
        "internal",
        { workflowId: string },
        {
          inProgress: Array<{
            _creationTime: number;
            _id: string;
            step: {
              args: any;
              argsSize: number;
              completedAt?: number;
              functionType: "query" | "mutation" | "action";
              handle: string;
              inProgress: boolean;
              name: string;
              runResult?:
                | { kind: "success"; returnValue: any }
                | { error: string; kind: "failed" }
                | { kind: "canceled" };
              startedAt: number;
              workId?: string;
            };
            stepNumber: number;
            workflowId: string;
          }>;
          journalEntries: Array<{
            _creationTime: number;
            _id: string;
            step: {
              args: any;
              argsSize: number;
              completedAt?: number;
              functionType: "query" | "mutation" | "action";
              handle: string;
              inProgress: boolean;
              name: string;
              runResult?:
                | { kind: "success"; returnValue: any }
                | { error: string; kind: "failed" }
                | { kind: "canceled" };
              startedAt: number;
              workId?: string;
            };
            stepNumber: number;
            workflowId: string;
          }>;
          logLevel: "DEBUG" | "TRACE" | "INFO" | "REPORT" | "WARN" | "ERROR";
          ok: boolean;
          workflow: {
            _creationTime: number;
            _id: string;
            args: any;
            generationNumber: number;
            logLevel?: any;
            name?: string;
            onComplete?: { context?: any; fnHandle: string };
            runResult?:
              | { kind: "success"; returnValue: any }
              | { error: string; kind: "failed" }
              | { kind: "canceled" };
            startedAt?: any;
            state?: any;
            workflowHandle: string;
          };
        }
      >;
      startStep: FunctionReference<
        "mutation",
        "internal",
        {
          generationNumber: number;
          name: string;
          retry?:
            | boolean
            | { base: number; initialBackoffMs: number; maxAttempts: number };
          schedulerOptions?: { runAt?: number } | { runAfter?: number };
          step: {
            args: any;
            argsSize: number;
            completedAt?: number;
            functionType: "query" | "mutation" | "action";
            handle: string;
            inProgress: boolean;
            name: string;
            runResult?:
              | { kind: "success"; returnValue: any }
              | { error: string; kind: "failed" }
              | { kind: "canceled" };
            startedAt: number;
            workId?: string;
          };
          workflowId: string;
          workpoolOptions?: {
            defaultRetryBehavior?: {
              base: number;
              initialBackoffMs: number;
              maxAttempts: number;
            };
            logLevel?: "DEBUG" | "TRACE" | "INFO" | "REPORT" | "WARN" | "ERROR";
            maxParallelism?: number;
            retryActionsByDefault?: boolean;
          };
        },
        {
          _creationTime: number;
          _id: string;
          step: {
            args: any;
            argsSize: number;
            completedAt?: number;
            functionType: "query" | "mutation" | "action";
            handle: string;
            inProgress: boolean;
            name: string;
            runResult?:
              | { kind: "success"; returnValue: any }
              | { error: string; kind: "failed" }
              | { kind: "canceled" };
            startedAt: number;
            workId?: string;
          };
          stepNumber: number;
          workflowId: string;
        }
      >;
    };
    workflow: {
      cancel: FunctionReference<
        "mutation",
        "internal",
        { workflowId: string },
        null
      >;
      cleanup: FunctionReference<
        "mutation",
        "internal",
        { workflowId: string },
        boolean
      >;
      complete: FunctionReference<
        "mutation",
        "internal",
        {
          generationNumber: number;
          now: number;
          runResult:
            | { kind: "success"; returnValue: any }
            | { error: string; kind: "failed" }
            | { kind: "canceled" };
          workflowId: string;
        },
        null
      >;
      create: FunctionReference<
        "mutation",
        "internal",
        {
          maxParallelism?: number;
          onComplete?: { context?: any; fnHandle: string };
          validateAsync?: boolean;
          workflowArgs: any;
          workflowHandle: string;
          workflowName: string;
        },
        string
      >;
      getStatus: FunctionReference<
        "query",
        "internal",
        { workflowId: string },
        {
          inProgress: Array<{
            _creationTime: number;
            _id: string;
            step: {
              args: any;
              argsSize: number;
              completedAt?: number;
              functionType: "query" | "mutation" | "action";
              handle: string;
              inProgress: boolean;
              name: string;
              runResult?:
                | { kind: "success"; returnValue: any }
                | { error: string; kind: "failed" }
                | { kind: "canceled" };
              startedAt: number;
              workId?: string;
            };
            stepNumber: number;
            workflowId: string;
          }>;
          logLevel: "DEBUG" | "TRACE" | "INFO" | "REPORT" | "WARN" | "ERROR";
          workflow: {
            _creationTime: number;
            _id: string;
            args: any;
            generationNumber: number;
            logLevel?: any;
            name?: string;
            onComplete?: { context?: any; fnHandle: string };
            runResult?:
              | { kind: "success"; returnValue: any }
              | { error: string; kind: "failed" }
              | { kind: "canceled" };
            startedAt?: any;
            state?: any;
            workflowHandle: string;
          };
        }
      >;
    };
  };
};
