import type { User } from "../types";

export function canViewAdmin(user: User | null): boolean {
  return user?.admin === true;
}
