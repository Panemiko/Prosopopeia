import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export * from "./auth";

export const application = pgTable("application", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),

  name: text("name").notNull(),
  company: text("company").notNull(),
  description: text("description").notNull(),
  userId: text("user_id").notNull(),
});

export const applicationRelations = relations(application, ({ one }) => ({
  user: one(user, {
    fields: [application.userId],
    references: [user.id],
  }),
}));
