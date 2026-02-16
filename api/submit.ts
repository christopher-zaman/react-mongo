import type { VercelRequest, VercelResponse } from "@vercel/node";
import clientPromise from "./_db.js";

const TOPIC_OPTIONS = new Set(["intake", "billing", "tech", "other"]);
const CONTACT_METHODS = new Set(["email", "phone", "text"]);

function isValidDateYYYYMMDD(s: unknown): s is string {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed. Use POST." });

  try {
    const body = req.body ?? {};

    const name = String(body.name ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!name || !message) {
      return res.status(400).json({ error: "Missing required fields: name and message." });
    }

    // Optional fields
    const email = body.email ? String(body.email).trim() : undefined;
    const phone = body.phone ? String(body.phone).trim() : undefined;

    const age =
      body.age === null || body.age === undefined || body.age === ""
        ? undefined
        : Number(body.age);

    if (age !== undefined && (!Number.isFinite(age) || age < 0 || age > 120)) {
      return res.status(400).json({ error: "Age must be a number between 0 and 120." });
    }

    const dob = isValidDateYYYYMMDD(body.dob) ? body.dob : undefined;
    const state = body.state ? String(body.state).trim() : undefined;

    const contactMethod = body.contactMethod ? String(body.contactMethod).trim() : undefined;
    if (contactMethod && !CONTACT_METHODS.has(contactMethod)) {
      return res.status(400).json({ error: "Invalid contactMethod." });
    }

    const topicsRaw: unknown = body.topics;
    const topics =
      Array.isArray(topicsRaw)
        ? topicsRaw
            .map((t) => String(t).trim())
            .filter((t) => TOPIC_OPTIONS.has(t))
        : [];

    const agree = Boolean(body.agree);
    if (!agree) {
      return res.status(400).json({ error: "You must check the required confirmation box." });
    }

    const client = await clientPromise;
    const dbName = process.env.MONGODB_DB || "mydb";
    const db = client.db(dbName);

    const doc = {
      name,
      email,
      phone,
      age,
      dob,
      state,
      contactMethod: contactMethod as "email" | "phone" | "text" | undefined,
      topics,
      message,
      agree,
      createdAt: new Date(),
    };

    const result = await db.collection("submissions").insertOne(doc);
    return res.status(200).json({ ok: true, insertedId: result.insertedId });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message ?? "Server error" });
  }
}
