import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  real,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ─── Users ──────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  company_name: text("company_name"),
  company_address: text("company_address"),
  company_nif: text("company_nif"),
  company_email: text("company_email"),
  company_phone: text("company_phone"),
  default_iva: real("default_iva").default(17),
  default_validity_days: integer("default_validity_days").default(30),
  default_payment_conditions: text("default_payment_conditions"),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users)
  .pick({ username: true, password: true })
  .extend({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// ─── Materials ──────────────────────────────────────────────────────────────

export const materials = pgTable("materials", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  unit: text("unit").notNull(),
  cost_price: real("cost_price").notNull().default(0),
  sell_price: real("sell_price").notNull().default(0),
  supplier: text("supplier"),
  reference: text("reference"),
  user_id: varchar("user_id"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const insertMaterialSchema = createInsertSchema(materials).pick({
  name: true,
  category: true,
  unit: true,
  cost_price: true,
  sell_price: true,
  supplier: true,
  reference: true,
}).extend({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  unit: z.string().min(1, "Unit is required"),
  cost_price: z.number().min(0, "Cost price must be >= 0"),
  sell_price: z.number().min(0, "Sell price must be >= 0"),
  supplier: z.string().optional(),
  reference: z.string().optional(),
});

export type InsertMaterial = z.infer<typeof insertMaterialSchema>;
export type Material = typeof materials.$inferSelect;

// ─── Labor ──────────────────────────────────────────────────────────────────

export const laborTable = pgTable("labor", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  trade: text("trade").notNull(),
  unit: text("unit").notNull(),
  price_lux: real("price_lux").notNull().default(0),
  price_pt: real("price_pt").notNull().default(0),
  user_id: varchar("user_id"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const insertLaborSchema = createInsertSchema(laborTable).pick({
  name: true,
  trade: true,
  unit: true,
  price_lux: true,
  price_pt: true,
}).extend({
  name: z.string().min(1, "Name is required"),
  trade: z.string().min(1, "Trade is required"),
  unit: z.string().min(1, "Unit is required"),
  price_lux: z.number().min(0, "Price LUX must be >= 0"),
  price_pt: z.number().min(0, "Price PT must be >= 0"),
});

export type InsertLabor = z.infer<typeof insertLaborSchema>;
export type Labor = typeof laborTable.$inferSelect;

// ─── Templates ──────────────────────────────────────────────────────────────

export const templates = pgTable("templates", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  is_system_template: boolean("is_system_template").default(false),
  sections: jsonb("sections").notNull().default([]),
  user_id: varchar("user_id"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const insertTemplateSchema = createInsertSchema(templates).pick({
  name: true,
  is_system_template: true,
  sections: true,
}).extend({
  name: z.string().min(1, "Name is required"),
  is_system_template: z.boolean().optional().default(false),
  sections: z.array(z.any()).optional().default([]),
});

export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;

// ─── Quotes ─────────────────────────────────────────────────────────────────

export const quotes = pgTable("quotes", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  quote_number: text("quote_number").notNull(),
  client_name: text("client_name").notNull(),
  client_email: text("client_email"),
  client_phone: text("client_phone"),
  client_address: text("client_address").notNull(),
  status: text("status").notNull().default("draft"),
  notes: text("notes"),
  payment_conditions: text("payment_conditions"),
  validity_days: integer("validity_days").default(30),
  execution_timeframe: text("execution_timeframe"),
  discount_percentage: real("discount_percentage").default(0),
  iva_rate: real("iva_rate").default(17),
  sections: jsonb("sections").notNull().default([]),
  total_materials: real("total_materials").default(0),
  total_labor: real("total_labor").default(0),
  subtotal: real("subtotal").default(0),
  discount_amount: real("discount_amount").default(0),
  iva_amount: real("iva_amount").default(0),
  total: real("total").default(0),
  user_id: varchar("user_id"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const insertQuoteSchema = createInsertSchema(quotes).pick({
  quote_number: true,
  client_name: true,
  client_email: true,
  client_phone: true,
  client_address: true,
  status: true,
  notes: true,
  payment_conditions: true,
  validity_days: true,
  execution_timeframe: true,
  discount_percentage: true,
  iva_rate: true,
  sections: true,
  total_materials: true,
  total_labor: true,
  subtotal: true,
  discount_amount: true,
  iva_amount: true,
  total: true,
}).extend({
  client_name: z.string().min(1, "Client name is required"),
  client_address: z.string().min(1, "Client address is required"),
  client_email: z.string().email().optional().or(z.literal("")),
  client_phone: z.string().optional(),
  status: z.enum(["draft", "sent", "accepted", "rejected"]).default("draft"),
  validity_days: z.number().int().min(1).default(30),
  discount_percentage: z.number().min(0).max(100).default(0),
  iva_rate: z.number().min(0).max(100).default(17),
  sections: z.array(z.any()).default([]),
  notes: z.string().optional(),
  payment_conditions: z.string().optional(),
  execution_timeframe: z.string().optional(),
  quote_number: z.string().min(1),
  total_materials: z.number().default(0),
  total_labor: z.number().default(0),
  subtotal: z.number().default(0),
  discount_amount: z.number().default(0),
  iva_amount: z.number().default(0),
  total: z.number().default(0),
});

export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type QuoteRecord = typeof quotes.$inferSelect;
