import type { Express, Request, Response } from "express";
import type { Server } from "http";
import passport from "passport";
import { storage } from "./storage";
import { hashPassword, requireAuth, sanitizeUser } from "./auth";
import {
  insertUserSchema,
  insertMaterialSchema,
  insertLaborSchema,
  insertTemplateSchema,
  insertQuoteSchema,
} from "@shared/schema";
import { ZodError } from "zod";

function handleZodError(res: Response, error: unknown) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Validation error",
      errors: error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }
  throw error;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // ─── Auth Routes ────────────────────────────────────────────────────────

  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const existing = await storage.getUserByUsername(data.username);
      if (existing) {
        return res.status(409).json({ message: "Username already exists" });
      }

      const hashed = await hashPassword(data.password);
      const user = await storage.createUser({ ...data, password: hashed });

      req.login(user, (err) => {
        if (err) return res.status(500).json({ message: "Login failed after registration" });
        return res.status(201).json(sanitizeUser(user));
      });
    } catch (error) {
      handleZodError(res, error);
    }
  });

  app.post("/api/auth/login", (req: Request, res: Response, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info?.message || "Invalid credentials" });

      req.login(user, (err) => {
        if (err) return next(err);
        return res.json(sanitizeUser(user));
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      return res.json({ message: "Logged out" });
    });
  });

  app.get("/api/auth/me", (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    return res.json(sanitizeUser(req.user as any));
  });

  // ─── Settings (User profile) ───────────────────────────────────────────

  app.patch("/api/settings", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const allowedFields = [
        "company_name",
        "company_address",
        "company_nif",
        "company_email",
        "company_phone",
        "default_iva",
        "default_validity_days",
        "default_payment_conditions",
      ];

      const updates: Record<string, any> = {};
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }

      const updated = await storage.updateUser(user.id, updates);
      if (!updated) return res.status(404).json({ message: "User not found" });
      return res.json(sanitizeUser(updated));
    } catch (error) {
      return res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // ─── Materials CRUD ─────────────────────────────────────────────────────

  app.get("/api/materials", async (_req: Request, res: Response) => {
    const items = await storage.getMaterials();
    return res.json(items);
  });

  app.get("/api/materials/:id", async (req: Request, res: Response) => {
    const item = await storage.getMaterial(req.params.id);
    if (!item) return res.status(404).json({ message: "Material not found" });
    return res.json(item);
  });

  app.post("/api/materials", async (req: Request, res: Response) => {
    try {
      const data = insertMaterialSchema.parse(req.body);
      const item = await storage.createMaterial(data);
      return res.status(201).json(item);
    } catch (error) {
      handleZodError(res, error);
    }
  });

  app.patch("/api/materials/:id", async (req: Request, res: Response) => {
    try {
      const data = insertMaterialSchema.partial().parse(req.body);
      const item = await storage.updateMaterial(req.params.id, data);
      if (!item) return res.status(404).json({ message: "Material not found" });
      return res.json(item);
    } catch (error) {
      handleZodError(res, error);
    }
  });

  app.delete("/api/materials/:id", async (req: Request, res: Response) => {
    const deleted = await storage.deleteMaterial(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Material not found" });
    return res.json({ message: "Deleted" });
  });

  // ─── Labor CRUD ─────────────────────────────────────────────────────────

  app.get("/api/labor", async (_req: Request, res: Response) => {
    const items = await storage.getLabor();
    return res.json(items);
  });

  app.get("/api/labor/:id", async (req: Request, res: Response) => {
    const item = await storage.getLaborById(req.params.id);
    if (!item) return res.status(404).json({ message: "Labor not found" });
    return res.json(item);
  });

  app.post("/api/labor", async (req: Request, res: Response) => {
    try {
      const data = insertLaborSchema.parse(req.body);
      const item = await storage.createLabor(data);
      return res.status(201).json(item);
    } catch (error) {
      handleZodError(res, error);
    }
  });

  app.patch("/api/labor/:id", async (req: Request, res: Response) => {
    try {
      const data = insertLaborSchema.partial().parse(req.body);
      const item = await storage.updateLabor(req.params.id, data);
      if (!item) return res.status(404).json({ message: "Labor not found" });
      return res.json(item);
    } catch (error) {
      handleZodError(res, error);
    }
  });

  app.delete("/api/labor/:id", async (req: Request, res: Response) => {
    const deleted = await storage.deleteLabor(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Labor not found" });
    return res.json({ message: "Deleted" });
  });

  // ─── Templates CRUD ────────────────────────────────────────────────────

  app.get("/api/templates", async (_req: Request, res: Response) => {
    const items = await storage.getTemplates();
    return res.json(items);
  });

  app.get("/api/templates/:id", async (req: Request, res: Response) => {
    const item = await storage.getTemplate(req.params.id);
    if (!item) return res.status(404).json({ message: "Template not found" });
    return res.json(item);
  });

  app.post("/api/templates", async (req: Request, res: Response) => {
    try {
      const data = insertTemplateSchema.parse(req.body);
      const item = await storage.createTemplate(data);
      return res.status(201).json(item);
    } catch (error) {
      handleZodError(res, error);
    }
  });

  app.patch("/api/templates/:id", async (req: Request, res: Response) => {
    try {
      const data = insertTemplateSchema.partial().parse(req.body);
      const item = await storage.updateTemplate(req.params.id, data);
      if (!item) return res.status(404).json({ message: "Template not found" });
      return res.json(item);
    } catch (error) {
      handleZodError(res, error);
    }
  });

  app.delete("/api/templates/:id", async (req: Request, res: Response) => {
    const deleted = await storage.deleteTemplate(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Template not found" });
    return res.json({ message: "Deleted" });
  });

  // ─── Quotes CRUD ───────────────────────────────────────────────────────

  app.get("/api/quotes", async (_req: Request, res: Response) => {
    const items = await storage.getQuotes();
    return res.json(items);
  });

  app.get("/api/quotes/:id", async (req: Request, res: Response) => {
    const item = await storage.getQuote(req.params.id);
    if (!item) return res.status(404).json({ message: "Quote not found" });
    return res.json(item);
  });

  app.post("/api/quotes", async (req: Request, res: Response) => {
    try {
      const data = insertQuoteSchema.parse(req.body);
      const item = await storage.createQuote(data);
      return res.status(201).json(item);
    } catch (error) {
      handleZodError(res, error);
    }
  });

  app.patch("/api/quotes/:id", async (req: Request, res: Response) => {
    try {
      const data = insertQuoteSchema.partial().parse(req.body);
      const item = await storage.updateQuote(req.params.id, data);
      if (!item) return res.status(404).json({ message: "Quote not found" });
      return res.json(item);
    } catch (error) {
      handleZodError(res, error);
    }
  });

  app.delete("/api/quotes/:id", async (req: Request, res: Response) => {
    const deleted = await storage.deleteQuote(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Quote not found" });
    return res.json({ message: "Deleted" });
  });

  return httpServer;
}
