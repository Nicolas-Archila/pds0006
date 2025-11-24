import { 
  ComputerService, 
  DeviceService, 
  MedicalDeviceService 
} from "@/core/service";

import Elysia from "elysia";

import { 
  CRITERIA_QUERY_PARAMS_SCHEMA, 
  CriteriaHelper 
} from "./criteria.helper";

import { 
  COMPUTER_REQUEST_SCHEMA, 
  ComputerRequest,
  MED_DEVICE_REQUEST_SCHEMA,
  MedDeviceRequest
} from "@/core/dto";

import { 
  Computer, 
  EnteredDevice, 
  FrequentComputer, 
  MedicalDevice 
} from "@/core/domain";


export class Controller {
  constructor(
    private computerService: ComputerService,
    private deviceService: DeviceService,
    private medicalDeviceService: MedicalDeviceService
  ) {}

  public routes() {
    return new Elysia({
      prefix: "/api",
    })
      .guard({
        query: CRITERIA_QUERY_PARAMS_SCHEMA,
      })
      .post(
        "/computers/checkin",
        async ({ body }): Promise<Computer> => {
          const req = body as ComputerRequest;
          return await this.computerService.checkIn(req);
        },
        { body: COMPUTER_REQUEST_SCHEMA }
      )
      .post(
        "/medical/checkin",
        async ({ body }): Promise<MedicalDevice> => {
          const req = body as MedDeviceRequest;
          return await this.medicalDeviceService.checkIn(req);
        },
        { body: MED_DEVICE_REQUEST_SCHEMA }
      )
      .get(
        "/devices",
        async ({ query }) => {
          const criteria = CriteriaHelper.parseFromQuery(query);
          return await this.deviceService.find(criteria);
        }
      );
  }
}
