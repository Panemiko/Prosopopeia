import { auth } from "@prosopopeia/auth";
import { createSafeActionClient } from "next-safe-action";
import { headers } from "next/headers";

export const publicActionClient = createSafeActionClient();

export const privateActionClient = publicActionClient.use(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  // Pass user data to the next layer via ctx
  return next({ ctx: { user: session.user } });
});
