"use server";

import { userProfileSchema } from "@/lib/schema";
import { db, eq } from "@prosopopeia/db";
import { user } from "@prosopopeia/db/schema/auth";
import z from "zod";
import { privateActionClient } from ".";

export const editUserProfileAction = privateActionClient
  .inputSchema(
    userProfileSchema.extend({
      name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    const { name, ...userProfile } = parsedInput;

    await db
      .update(user)
      .set({
        name,
        profileJson: JSON.stringify(userProfile),
      })
      .where(eq(user.id, ctx.user.id));
  });
