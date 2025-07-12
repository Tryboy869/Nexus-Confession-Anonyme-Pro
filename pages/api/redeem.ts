import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/database";

const VALID_CODES = {
  "PACK5-XYZ": 5,
  "PACK5-123": 5,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { code, userId } = req.body;

  if (!VALID_CODES[code]) {
    return res.status(400).json({ error: "Code invalide" });
  }

  const messagesToAdd = VALID_CODES[code];
  await db.addMessages(userId, messagesToAdd);

  delete VALID_CODES[code]; // Code à usage unique

  return res.status(200).json({ success: true, added: messagesToAdd });
}
