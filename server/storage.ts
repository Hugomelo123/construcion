import {
  type User,
  type InsertUser,
  type Material,
  type InsertMaterial,
  type Labor,
  type InsertLabor,
  type Template,
  type InsertTemplate,
  type QuoteRecord,
  type InsertQuote,
  users,
  materials,
  laborTable,
  templates,
  quotes,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

// ─── Interface ──────────────────────────────────────────────────────────────

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User | undefined>;

  // Materials
  getMaterials(): Promise<Material[]>;
  getMaterial(id: string): Promise<Material | undefined>;
  createMaterial(data: InsertMaterial): Promise<Material>;
  updateMaterial(id: string, data: Partial<InsertMaterial>): Promise<Material | undefined>;
  deleteMaterial(id: string): Promise<boolean>;

  // Labor
  getLabor(): Promise<Labor[]>;
  getLaborById(id: string): Promise<Labor | undefined>;
  createLabor(data: InsertLabor): Promise<Labor>;
  updateLabor(id: string, data: Partial<InsertLabor>): Promise<Labor | undefined>;
  deleteLabor(id: string): Promise<boolean>;

  // Templates
  getTemplates(): Promise<Template[]>;
  getTemplate(id: string): Promise<Template | undefined>;
  createTemplate(data: InsertTemplate): Promise<Template>;
  updateTemplate(id: string, data: Partial<InsertTemplate>): Promise<Template | undefined>;
  deleteTemplate(id: string): Promise<boolean>;

  // Quotes
  getQuotes(): Promise<QuoteRecord[]>;
  getQuote(id: string): Promise<QuoteRecord | undefined>;
  createQuote(data: InsertQuote): Promise<QuoteRecord>;
  updateQuote(id: string, data: Partial<InsertQuote>): Promise<QuoteRecord | undefined>;
  deleteQuote(id: string): Promise<boolean>;
}

// ─── In-Memory Storage (fallback) ───────────────────────────────────────────

export class MemStorage implements IStorage {
  private usersMap: Map<string, User> = new Map();
  private materialsMap: Map<string, Material> = new Map();
  private laborMap: Map<string, Labor> = new Map();
  private templatesMap: Map<string, Template> = new Map();
  private quotesMap: Map<string, QuoteRecord> = new Map();

  // Users
  async getUser(id: string) {
    return this.usersMap.get(id);
  }
  async getUserByUsername(username: string) {
    return Array.from(this.usersMap.values()).find((u) => u.username === username);
  }
  async createUser(data: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      username: data.username,
      password: data.password,
      company_name: null,
      company_address: null,
      company_nif: null,
      company_email: null,
      company_phone: null,
      default_iva: 17,
      default_validity_days: 30,
      default_payment_conditions: null,
      created_at: new Date(),
    };
    this.usersMap.set(id, user);
    return user;
  }
  async updateUser(id: string, data: Partial<User>) {
    const user = this.usersMap.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...data };
    this.usersMap.set(id, updated);
    return updated;
  }

  // Materials
  async getMaterials() {
    return Array.from(this.materialsMap.values());
  }
  async getMaterial(id: string) {
    return this.materialsMap.get(id);
  }
  async createMaterial(data: InsertMaterial): Promise<Material> {
    const id = randomUUID();
    const mat: Material = {
      id,
      name: data.name,
      category: data.category,
      unit: data.unit,
      cost_price: data.cost_price ?? 0,
      sell_price: data.sell_price ?? 0,
      supplier: data.supplier ?? null,
      reference: data.reference ?? null,
      user_id: null,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.materialsMap.set(id, mat);
    return mat;
  }
  async updateMaterial(id: string, data: Partial<InsertMaterial>) {
    const mat = this.materialsMap.get(id);
    if (!mat) return undefined;
    const updated = { ...mat, ...data, updated_at: new Date() } as Material;
    this.materialsMap.set(id, updated);
    return updated;
  }
  async deleteMaterial(id: string) {
    return this.materialsMap.delete(id);
  }

  // Labor
  async getLabor() {
    return Array.from(this.laborMap.values());
  }
  async getLaborById(id: string) {
    return this.laborMap.get(id);
  }
  async createLabor(data: InsertLabor): Promise<Labor> {
    const id = randomUUID();
    const lab: Labor = {
      id,
      name: data.name,
      trade: data.trade,
      unit: data.unit,
      price_lux: data.price_lux ?? 0,
      price_pt: data.price_pt ?? 0,
      user_id: null,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.laborMap.set(id, lab);
    return lab;
  }
  async updateLabor(id: string, data: Partial<InsertLabor>) {
    const lab = this.laborMap.get(id);
    if (!lab) return undefined;
    const updated = { ...lab, ...data, updated_at: new Date() } as Labor;
    this.laborMap.set(id, updated);
    return updated;
  }
  async deleteLabor(id: string) {
    return this.laborMap.delete(id);
  }

  // Templates
  async getTemplates() {
    return Array.from(this.templatesMap.values());
  }
  async getTemplate(id: string) {
    return this.templatesMap.get(id);
  }
  async createTemplate(data: InsertTemplate): Promise<Template> {
    const id = randomUUID();
    const tpl: Template = {
      id,
      name: data.name,
      is_system_template: data.is_system_template ?? false,
      sections: data.sections ?? [],
      user_id: null,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.templatesMap.set(id, tpl);
    return tpl;
  }
  async updateTemplate(id: string, data: Partial<InsertTemplate>) {
    const tpl = this.templatesMap.get(id);
    if (!tpl) return undefined;
    const updated = { ...tpl, ...data, updated_at: new Date() } as Template;
    this.templatesMap.set(id, updated);
    return updated;
  }
  async deleteTemplate(id: string) {
    return this.templatesMap.delete(id);
  }

  // Quotes
  async getQuotes() {
    return Array.from(this.quotesMap.values());
  }
  async getQuote(id: string) {
    return this.quotesMap.get(id);
  }
  async createQuote(data: InsertQuote): Promise<QuoteRecord> {
    const id = randomUUID();
    const quote: QuoteRecord = {
      id,
      quote_number: data.quote_number,
      client_name: data.client_name,
      client_email: data.client_email ?? null,
      client_phone: data.client_phone ?? null,
      client_address: data.client_address,
      status: data.status ?? "draft",
      notes: data.notes ?? null,
      payment_conditions: data.payment_conditions ?? null,
      validity_days: data.validity_days ?? 30,
      execution_timeframe: data.execution_timeframe ?? null,
      discount_percentage: data.discount_percentage ?? 0,
      iva_rate: data.iva_rate ?? 17,
      sections: data.sections ?? [],
      total_materials: data.total_materials ?? 0,
      total_labor: data.total_labor ?? 0,
      subtotal: data.subtotal ?? 0,
      discount_amount: data.discount_amount ?? 0,
      iva_amount: data.iva_amount ?? 0,
      total: data.total ?? 0,
      user_id: null,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.quotesMap.set(id, quote);
    return quote;
  }
  async updateQuote(id: string, data: Partial<InsertQuote>) {
    const quote = this.quotesMap.get(id);
    if (!quote) return undefined;
    const updated = { ...quote, ...data, updated_at: new Date() } as QuoteRecord;
    this.quotesMap.set(id, updated);
    return updated;
  }
  async deleteQuote(id: string) {
    return this.quotesMap.delete(id);
  }
}

// ─── Database Storage (Drizzle + PostgreSQL) ────────────────────────────────

export class DatabaseStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor(connectionString: string) {
    const pool = new pg.Pool({ connectionString });
    this.db = drizzle(pool);
  }

  // Users
  async getUser(id: string) {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByUsername(username: string) {
    const [user] = await this.db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async createUser(data: InsertUser): Promise<User> {
    const [user] = await this.db.insert(users).values(data).returning();
    return user;
  }
  async updateUser(id: string, data: Partial<User>) {
    const [user] = await this.db.update(users).set(data).where(eq(users.id, id)).returning();
    return user;
  }

  // Materials
  async getMaterials() {
    return this.db.select().from(materials);
  }
  async getMaterial(id: string) {
    const [mat] = await this.db.select().from(materials).where(eq(materials.id, id));
    return mat;
  }
  async createMaterial(data: InsertMaterial): Promise<Material> {
    const [mat] = await this.db.insert(materials).values(data).returning();
    return mat;
  }
  async updateMaterial(id: string, data: Partial<InsertMaterial>) {
    const [mat] = await this.db
      .update(materials)
      .set({ ...data, updated_at: new Date() })
      .where(eq(materials.id, id))
      .returning();
    return mat;
  }
  async deleteMaterial(id: string) {
    const result = await this.db.delete(materials).where(eq(materials.id, id)).returning();
    return result.length > 0;
  }

  // Labor
  async getLabor() {
    return this.db.select().from(laborTable);
  }
  async getLaborById(id: string) {
    const [lab] = await this.db.select().from(laborTable).where(eq(laborTable.id, id));
    return lab;
  }
  async createLabor(data: InsertLabor): Promise<Labor> {
    const [lab] = await this.db.insert(laborTable).values(data).returning();
    return lab;
  }
  async updateLabor(id: string, data: Partial<InsertLabor>) {
    const [lab] = await this.db
      .update(laborTable)
      .set({ ...data, updated_at: new Date() })
      .where(eq(laborTable.id, id))
      .returning();
    return lab;
  }
  async deleteLabor(id: string) {
    const result = await this.db.delete(laborTable).where(eq(laborTable.id, id)).returning();
    return result.length > 0;
  }

  // Templates
  async getTemplates() {
    return this.db.select().from(templates);
  }
  async getTemplate(id: string) {
    const [tpl] = await this.db.select().from(templates).where(eq(templates.id, id));
    return tpl;
  }
  async createTemplate(data: InsertTemplate): Promise<Template> {
    const [tpl] = await this.db.insert(templates).values(data).returning();
    return tpl;
  }
  async updateTemplate(id: string, data: Partial<InsertTemplate>) {
    const [tpl] = await this.db
      .update(templates)
      .set({ ...data, updated_at: new Date() })
      .where(eq(templates.id, id))
      .returning();
    return tpl;
  }
  async deleteTemplate(id: string) {
    const result = await this.db.delete(templates).where(eq(templates.id, id)).returning();
    return result.length > 0;
  }

  // Quotes
  async getQuotes() {
    return this.db.select().from(quotes);
  }
  async getQuote(id: string) {
    const [quote] = await this.db.select().from(quotes).where(eq(quotes.id, id));
    return quote;
  }
  async createQuote(data: InsertQuote): Promise<QuoteRecord> {
    const [quote] = await this.db.insert(quotes).values(data).returning();
    return quote;
  }
  async updateQuote(id: string, data: Partial<InsertQuote>) {
    const [quote] = await this.db
      .update(quotes)
      .set({ ...data, updated_at: new Date() })
      .where(eq(quotes.id, id))
      .returning();
    return quote;
  }
  async deleteQuote(id: string) {
    const result = await this.db.delete(quotes).where(eq(quotes.id, id)).returning();
    return result.length > 0;
  }
}

// ─── Factory ────────────────────────────────────────────────────────────────

function createStorage(): IStorage {
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    console.log("[storage] Using PostgreSQL database");
    return new DatabaseStorage(dbUrl);
  }
  console.log("[storage] DATABASE_URL not set — using in-memory storage");
  return new MemStorage();
}

export const storage = createStorage();
