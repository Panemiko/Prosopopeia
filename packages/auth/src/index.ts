import { createDb } from "@prosopopeia/db";
import * as schema from "@prosopopeia/db/schema/auth";
import { env } from "@prosopopeia/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";

export function createAuth() {
  const db = createDb();

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: schema,
    }),
    trustedOrigins: [env.CORS_ORIGIN],
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    plugins: [
      emailOTP({
        async sendVerificationOTP({ email, otp, type }) {
          console.log(`Novo OTP de ${email}: ${otp} (${type})`);
        },
      }),
      nextCookies(),
    ],
  });
}

export const auth = createAuth();
