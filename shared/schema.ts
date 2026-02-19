import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We'll store the "messages" in the database as a backup for the letter feature.
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  sender: text("sender").default("Anonymous"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  content: true,
  sender: true,
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// Configuration schema for the app content (to be served via API)
export const appConfigSchema = z.object({
  recipientName: z.string(),
  targetDate: z.string(), // ISO string
  birthdayMessage: z.string(),
  senderEmail: z.string().email(),
  sender: z.string().optional(),
  gifts: z.array(z.object({
    id: z.string(),
    label: z.string(), // "Gift 1"
    content: z.string(), // "Unlimited Hugs"
    image: z.string().optional(), // URL to gif
  })),
});

export type AppConfig = z.infer<typeof appConfigSchema>;
