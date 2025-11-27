import { ElysiaApiAdapter } from "./adapter/api/elysia/elysia.api";
import { FileSystemPhotoRepository } from "./adapter/photo/filesystem";
import { InMemoryDeviceRepository } from "./adapter/repository/inmemory";
import { ComputerService, DeviceService, MedicalDeviceService } from "./core/service";
import "dotenv/config";
const deviceRepository = new InMemoryDeviceRepository();
const photoRepository = new FileSystemPhotoRepository();

const computerService = new ComputerService(
    deviceRepository,
    photoRepository,
    new URL("http://localhost:3000")
);

const deviceService = new DeviceService(deviceRepository);

const medicalDeviceService = new MedicalDeviceService(
    deviceRepository,
    photoRepository
);

const app = new ElysiaApiAdapter(
    computerService,
    deviceService,
    medicalDeviceService
);

app.run();
