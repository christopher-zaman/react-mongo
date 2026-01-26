import type { VercelRequest, VercelResponse } from "@vercel/node";
import clientPromise from "./_db.ts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { name, message } = req.body ?? {};

    if (!name || !message) {
      return res.status(400).json({ error: "Missing name or message." });
    }

    const client = await clientPromise;
    const dbName = process.env.MONGODB_DB || "mydb";
    const db = client.db(dbName);

    const doc = {
      name: String(name).trim(),
      message: String(message).trim(),
      createdAt: new Date(),
    };

    const result = await db.collection("submissions").insertOne(doc);

    return res.status(200).json({ ok: true, insertedId: result.insertedId });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message ?? "Server error" });
  }
}
