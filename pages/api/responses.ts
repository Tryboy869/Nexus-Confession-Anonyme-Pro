import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/database";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { messageId, response } = req.body;
    await db.saveResponse(messageId, response);
    return res.status(200).json({ success: true });
  }

  res.status(405).end();
}
