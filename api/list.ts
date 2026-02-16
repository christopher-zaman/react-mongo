import type { VercelRequest, VercelResponse } from "@vercel/node";
import clientPromise from "./_db.js";

function parseLimit(v: unknown, fallback = 20) {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(1, Math.min(50, Math.floor(n)));
}

function parseDateYYYYMMDD(v: unknown): Date | undefined {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return undefined;
  const d = new Date(`${v}T00:00:00.000Z`);
  return Number.isFinite(d.getTime()) ? d : undefined;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    console.log("MONGODB_URI present:", !!process.env.MONGODB_URI);

  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed. Use GET." });

  try {
    const client = await clientPromise;
    const dbName = process.env.MONGODB_DB || "mydb";
    const db = client.db(dbName);

    const email = typeof req.query.email === "string" ? req.query.email.trim() : "";
    const topic = typeof req.query.topic === "string" ? req.query.topic.trim() : "";
    const from = parseDateYYYYMMDD(req.query.from);
    const to = parseDateYYYYMMDD(req.query.to);
    const limit = parseLimit(req.query.limit, 20);

    const filter: Record<string, any> = {};

    if (email) filter.email = email;
    if (topic) filter.topics = topic; // matches arrays containing the value

    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = from;
      if (to) {
        // include the whole "to" day by making it end-exclusive next day
        const end = new Date(to.getTime() + 24 * 60 * 60 * 1000);
        filter.createdAt.$lt = end;
      }
    }

    const items = await db
      .collection("submissions")
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    // Convert ObjectId + Date to JSON-friendly strings
    const safe = items.map((it: any) => ({
      ...it,
      _id: String(it._id),
      createdAt: it.createdAt ? new Date(it.createdAt).toISOString() : undefined,
    }));

    return res.status(200).json({ ok: true, items: safe });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message ?? "Server error" });
  }
}
