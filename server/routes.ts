import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { appConfigSchema, type AppConfig } from "@shared/schema";
import fs from "fs/promises";
import path from "path";

async function loadConfig(): Promise<AppConfig> {
  const configPath = path.resolve(process.cwd(), "config.json");
  try {
    const data = await fs.readFile(configPath, "utf-8");
    const json = JSON.parse(data);
    return appConfigSchema.parse(json);
  } catch (err) {
    console.error("Failed to load config.json, using fallback:", err);
    // Fallback if file doesn't exist or is invalid
    return {
      recipientName: "Bestie",
      targetDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24).toISOString(),
      birthdayMessage: "Happy Birthday! You are the best friend anyone could ask for. Here's to another year of adventures!",
      senderEmail: "sender@example.com",
      sender: "Your Best Friend",
      gifts: [
        { id: "1", label: "Mystery Box 1", content: "Unlimited Hugs Coupon! 🤗", image: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExODg3YmRhZGUxMmU0ZWRlMjE5OWUzYjQ5Y2E4OTQ2ZDAwZDAwZDAwZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oEdv4hwTZKSsUH8t6/giphy.gif" },
        { id: "2", label: "Mystery Box 2", content: "Coffee Date on Me! ☕", image: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExODg3YmRhZGUxMmU0ZWRlMjE5OWUzYjQ5Y2E4OTQ2ZDAwZDAwZDAwZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIP8kNuTJJL3zK00/giphy.gif" },
        { id: "3", label: "Mystery Box 3", content: "Movie Night Choice! 🎬", image: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExODg3YmRhZGUxMmU0ZWRlMjE5OWUzYjQ5Y2E4OTQ2ZDAwZDAwZDAwZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26BRzozg4TCJkTgqa/giphy.gif" },
      ]
    };
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.config.get.path, async (_req, res) => {
    const config = await loadConfig();
    res.json(config);
  });

  app.post(api.messages.create.path, async (req, res) => {
    try {
      const input = api.messages.create.input.parse(req.body);
      const message = await storage.createMessage(input);
      res.status(201).json(message);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  return httpServer;
}
