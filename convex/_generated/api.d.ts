/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as adminBootstrap from "../adminBootstrap.js";
import type * as adminBootstrapInternal from "../adminBootstrapInternal.js";
import type * as adminExport from "../adminExport.js";
import type * as adminPermissions from "../adminPermissions.js";
import type * as assistant from "../assistant.js";
import type * as auth from "../auth.js";
import type * as authInternal from "../authInternal.js";
import type * as basicSettings from "../basicSettings.js";
import type * as captains from "../captains.js";
import type * as categories from "../categories.js";
import type * as cleanup from "../cleanup.js";
import type * as constants from "../constants.js";
import type * as export_ from "../export.js";
import type * as exportAll from "../exportAll.js";
import type * as files from "../files.js";
import type * as http from "../http.js";
import type * as importData from "../importData.js";
import type * as location from "../location.js";
import type * as notifications from "../notifications.js";
import type * as orders from "../orders.js";
import type * as passwordReset from "../passwordReset.js";
import type * as passwordResetInternal from "../passwordResetInternal.js";
import type * as permissions from "../permissions.js";
import type * as products from "../products.js";
import type * as profiles from "../profiles.js";
import type * as promotions from "../promotions.js";
import type * as reviews from "../reviews.js";
import type * as router from "../router.js";
import type * as security from "../security.js";
import type * as seedAdmin from "../seedAdmin.js";
import type * as stores from "../stores.js";
import type * as subscriptions from "../subscriptions.js";
import type * as systemSettings from "../systemSettings.js";
import type * as validators from "../validators.js";
import type * as wallets from "../wallets.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  adminBootstrap: typeof adminBootstrap;
  adminBootstrapInternal: typeof adminBootstrapInternal;
  adminExport: typeof adminExport;
  adminPermissions: typeof adminPermissions;
  assistant: typeof assistant;
  auth: typeof auth;
  authInternal: typeof authInternal;
  basicSettings: typeof basicSettings;
  captains: typeof captains;
  categories: typeof categories;
  cleanup: typeof cleanup;
  constants: typeof constants;
  export: typeof export_;
  exportAll: typeof exportAll;
  files: typeof files;
  http: typeof http;
  importData: typeof importData;
  location: typeof location;
  notifications: typeof notifications;
  orders: typeof orders;
  passwordReset: typeof passwordReset;
  passwordResetInternal: typeof passwordResetInternal;
  permissions: typeof permissions;
  products: typeof products;
  profiles: typeof profiles;
  promotions: typeof promotions;
  reviews: typeof reviews;
  router: typeof router;
  security: typeof security;
  seedAdmin: typeof seedAdmin;
  stores: typeof stores;
  subscriptions: typeof subscriptions;
  systemSettings: typeof systemSettings;
  validators: typeof validators;
  wallets: typeof wallets;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
