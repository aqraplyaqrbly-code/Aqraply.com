// Re-export unified auth context (App uses AuthContextNew provider)
export {
  AuthProvider,
  useAuth,
  useRequireAuth,
  type User,
  type UserRole,
} from "./AuthContextNew";
