// src/core/logger/axiom.ts
import axios from "axios";

const AXIOM_API_TOKEN = process.env.AXIOM_API_TOKEN;
const AXIOM_DATASET = process.env.AXIOM_DATASET;

export async function sendLogToAxiom(log: any) {
    if (!AXIOM_API_TOKEN || !AXIOM_DATASET) {
        console.warn("⚠️ Axiom not configured");
        return;
    }

    try {
        await axios.post(
            `https://api.axiom.co/v1/datasets/${AXIOM_DATASET}/ingest`,
            [log],
            {
                headers: {
                    "Authorization": `Bearer ${AXIOM_API_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );
    } catch (err) {
        console.error("❌ Error sending log to Axiom:", err);
    }
}
