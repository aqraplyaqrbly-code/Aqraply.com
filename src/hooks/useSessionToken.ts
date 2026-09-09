import { useContext } from "react";
import { AuthContextNew } from "../contexts/AuthContextNew";

export function useSessionToken() {
  const { sessionToken } = useContext(AuthContextNew);
  return sessionToken;
}
