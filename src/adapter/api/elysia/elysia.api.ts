import { ComputerService, DeviceService, MedicalDeviceService } from "@/core/service";
import { Controller } from "./controller.elysia";

import openapi from "@elysiajs/openapi";
import { Elysia } from "elysia";

// ---------------------------
//  AXIOM LOGGING FUNCTION
// ---------------------------
async function sendLogToAxiom(log: any) {
    const AXIOM_API_TOKEN = process.env.AXIOM_API_TOKEN;
    const AXIOM_DATASET = process.env.AXIOM_DATASET;

    // Si no está configurado, evitar errores
    if (!AXIOM_API_TOKEN || !AXIOM_DATASET) {
        console.warn("⚠️ Axiom not configured");
        return;
    }

    try {
        await fetch(`https://api.axiom.co/v1/datasets/${AXIOM_DATASET}/ingest`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${AXIOM_API_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify([log])
        });
    } catch (error) {
        console.error("❌ Error sending log to Axiom:", error);
    }
}

export class ElysiaApiAdapter {
    private controller: Controller;
    private app;

    constructor(
        computerService: ComputerService,
        deviceService: DeviceService,
        medicalDeviceService: MedicalDeviceService
    ) {
        this.controller = new Controller(
            computerService,
            deviceService,
            medicalDeviceService
        );

        this.app = new Elysia()

            // Middleware para enviar LOGS a Axiom en cada request
            .onRequest(async ({ request }) => {
                const log = {
                    level: "info",
                    message: "Incoming Request",
                    method: request.method,
                    url: request.url,
                    timestamp: new Date().toISOString()
                };

                sendLogToAxiom(log);
            })

            // OpenAPI
            .use(openapi({}))

            // Ruta raíz
            .get("/", () => "Hello from PDS006!")

            // Health check
            .get("/health", () => ({
                status: "ok",
                timestamp: new Date().toISOString()
            }))

            // Tus rutas del controller
            .use(this.controller.routes());
    }

    async run() {
        this.app.listen(3000);
        console.log("🦊 Server running on http://localhost:3000");
    }
}
