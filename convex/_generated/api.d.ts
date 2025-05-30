/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as action_categories from "../action_categories.js";
import type * as auth from "../auth.js";
import type * as http from "../http.js";
import type * as user from "../user.js";
import type * as workflow from "../workflow.js";
import type * as workflow_config from "../workflow_config.js";
import type * as workflow_steps from "../workflow_steps.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  action_categories: typeof action_categories;
  auth: typeof auth;
  http: typeof http;
  user: typeof user;
  workflow: typeof workflow;
  workflow_config: typeof workflow_config;
  workflow_steps: typeof workflow_steps;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
