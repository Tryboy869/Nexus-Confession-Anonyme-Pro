import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/database";
import { sendEmail } from "@/lib/email";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { recipientEmail, message } = req.body;
    const id = Date.now().toString(36);
    await db.saveMessage(id, message);

    const link = `https://confessionpro.com/respond/${id}`;
    await sendEmail(recipientEmail, message, link);

    return res.status(200).json({ success: true });
  }

  if (req.method === "GET") {
    const id = req.query.id as string;
    const message = await db.getMessage(id);
    return res.status(200).json({ message });
  }

  res.status(405).end();
  }
