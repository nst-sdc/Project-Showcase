"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { PropsWithChildren } from "react";

export function SessionProvider({ children }: PropsWithChildren) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
