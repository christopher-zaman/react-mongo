import type { VercelRequest, VercelResponse } from "@vercel/node";
import clientPromise from "./_db";
console.log("MONGODB_URI present:", !!process.env.MONGODB_URI);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const client = await clientPromise;
    const dbName = process.env.MONGODB_DB || "mydb";
    const db = client.db(dbName);

    const items = await db
      .collection("submissions")
      .find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    return res.status(200).json({ ok: true, items });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message ?? "Server error" });
  }
}
