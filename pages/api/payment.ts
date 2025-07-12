import { NextApiRequest, NextApiResponse } from "next";
import paypal from "@/lib/paypal";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const order = await paypal.createOrder(3.00); // Crée un paiement de 3$
    return res.status(200).json({ id: order.id });
  } catch (err) {
    console.error("Erreur création paiement:", err);
    return res.status(500).json({ error: "Échec de la création de l’ordre" });
  }
}
