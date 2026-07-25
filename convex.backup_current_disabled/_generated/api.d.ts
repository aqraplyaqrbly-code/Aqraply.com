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
import type * as adminExport from "../adminExport.js";
import type * as auth from "../auth.js";
import type * as basicSettings from "../basicSettings.js";
import type * as captains from "../captains.js";
import type * as constants from "../constants.js";
import type * as customAuth from "../customAuth.js";
import type * as customAuthInternal from "../customAuthInternal.js";
import type * as files from "../files.js";
import type * as http from "../http.js";
import type * as location from "../location.js";
import type * as notifications from "../notifications.js";
import type * as orders from "../orders.js";
import type * as permissions from "../permissions.js";
import type * as products from "../products.js";
import type * as profiles from "../profiles.js";
import type * as promotions from "../promotions.js";
import type * as reviews from "../reviews.js";
import type * as router from "../router.js";
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
  adminExport: typeof adminExport;
  auth: typeof auth;
  basicSettings: typeof basicSettings;
  captains: typeof captains;
  constants: typeof constants;
  customAuth: typeof customAuth;
  customAuthInternal: typeof customAuthInternal;
  files: typeof files;
  http: typeof http;
  location: typeof location;
  notifications: typeof notifications;
  orders: typeof orders;
  permissions: typeof permissions;
  products: typeof products;
  profiles: typeof profiles;
  promotions: typeof promotions;
  reviews: typeof reviews;
  router: typeof router;
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
