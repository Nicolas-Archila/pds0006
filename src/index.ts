import { ElysiaApiAdapter } from "./adapter/api/elysia";
import { FileSystemPhotoRepository } from "./adapter/photo/filesystem";
import { InMemoryDeviceRepository } from "./adapter/repository/inmemory";
import { ComputerService, DeviceService, MedicalDeviceService } from "./core/service";
import { Elysia } from "elysia";
import { axiomPlugin } from "@adapter/plugins/axiom.plugin";
import { logger } from "@core/utils/logger";

const deviceRepository = new InMemoryDeviceRepository()
const photoRepository = new FileSystemPhotoRepository()

const computerService = new ComputerService(
    deviceRepository, 
    photoRepository, 
    new URL("http://localhost:3000")
)

const deviceService = new DeviceService(deviceRepository)

const medicalDeviceService = new MedicalDeviceService(
    deviceRepository,
    photoRepository
)

const app = new ElysiaApiAdapter(
    computerService,
    deviceService,
    medicalDeviceService
)

const app = new Elysia()
  .use(axiomPlugin) // Agregar el plugin
  .get("/", () => "Hello from PDS006!")
  .get("/health", () => ({ status: "ok", timestamp: new Date() }))
  // ... tus otras rutas
  .listen(process.env.PORT || 3000);

logger.info("Server started", { port: app.server?.port });

console.log(`🦊 Server running on http://localhost:${app.server?.port}`);

app.run()
