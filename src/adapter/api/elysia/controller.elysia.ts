import { Elysia } from "elysia";
import { ComputerService, DeviceService, MedicalDeviceService } from "@/core/service";

export class Controller {
    constructor(
        private computerService: ComputerService,
        private deviceService: DeviceService,
        private medicalDeviceService: MedicalDeviceService
    ) {}

    routes() {
        return new Elysia()

            // ---------- HEALTH CHECK ----------
            .get("/health", () => {
                return { status: "ok" };
            })

            // ---------- LIST DEVICES ----------
            .get("/api/devices", async () => {
                return await this.deviceService.getEnteredDevices({});
            })

            // ---------- COMPUTER CHECKIN ----------
            .post("/api/computers/checkin", async (ctx) => {
                const body = ctx.body as {
                    brand: string;
                    model: string;
                    ownerName: string;
                    ownerId: string;
                    photo: File;
                    serial: string;
                };

                return await this.computerService.checkinComputer(body);
            })

            // ---------- MEDICAL DEVICE CHECKIN ----------
            .post("/api/medical/checkin", async (ctx) => {
                const body = ctx.body as {
                    brand: string;
                    model: string;
                    ownerName: string;
                    ownerId: string;
                    photo: File;
                    serial: string;
                    color?: string;
                };

                return await this.medicalDeviceService.checkinMedicalDevice(body);
            });
    }
}
