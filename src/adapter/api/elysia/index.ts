import { ComputerService, DeviceService, MedicalDeviceService } from "@/core/service";
import { Controller } from "./controller.elysia";
import "dotenv/config";
import openapi from "@elysiajs/openapi";
import { Elysia } from "elysia";

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
            .use(openapi({}))
            .get("/", () => "Hello from PDS006!")
            .get("/health", () => ({
                status: "ok",
                timestamp: new Date()
            }))
            .use(this.controller.routes());
    }

    async run() {
        this.app.listen(3000);
        console.log("🦊 Server running on http://localhost:3000");
    }
}
