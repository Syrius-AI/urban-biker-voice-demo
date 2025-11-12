import Retell from "retell-sdk";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    res.status(405).end();
    return;
  }
  const { agentId: agentIdFromBody } = req.body || {};
  const agentId = agentIdFromBody || process.env.RETELL_AGENT_ID;
  if (!agentId) {
    res.status(400).json({ error: "Falta agentId" });
    return;
  }
  try {
    const client = new Retell({ apiKey: process.env.RETELL_API_KEY });
    const webCallResponse = await client.call.createWebCall({ agent_id: agentId });
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ access_token: webCallResponse.access_token });
  } catch (e) {
    res.status(500).json({ error: "Error al crear la llamada" });
  }
}
