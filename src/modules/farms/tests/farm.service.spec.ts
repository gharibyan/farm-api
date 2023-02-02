import { Express } from "express";
import http, { Server } from "http";
import { setupServer } from "server/server";
import { disconnectAndClearDatabase } from "helpers/utils";
import { CreateUserDto } from "../../users/dto/create-user.dto";
import { User } from "../../users/entities/user.entity";
import { UsersService } from "../../users/users.service";
import { FarmCreateDto } from "../dto/farm-create.dto";
import { Farm } from "../entities/farm.entity";
import { FarmsService } from "../farms.service";
import { getAddressData } from "../../../helpers/google-maps";
import config from "config/config";
import ds from "orm/orm.config";



jest.mock("../../../helpers/google-maps", () => ({
  getAddressData: jest.fn( (address: string) => {
    return  {
      address: address,
      coordinates: { lat: 10, lng: 20 }
    }
  })
}));

test("Check getAddressData is Mocked ", async () => {
  const addressResponse = await getAddressData("Some Address")
  expect(addressResponse?.address).toEqual("Some Address")
  expect(addressResponse?.coordinates).toEqual({ lat: 10, lng: 20 })
});

describe("FarmService", () => {
  let app: Express;
  let server: Server;

  let farmService: FarmsService;
  let usersService: UsersService;

  beforeAll(() => {
    app = setupServer();
    server = http.createServer(app).listen(config.APP_PORT);
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(async () => {
    await ds.initialize();
    farmService = new FarmsService();
    usersService = new UsersService();
  });

  afterEach(async () => {
    await disconnectAndClearDatabase(ds);
  });

  describe(".createFarm", () => {
    it("should create new farm for user", async ()=>{
      const createUserDto: CreateUserDto = { email: "user@test.com", password: "password" };
      const createdUser = await usersService.createUser(createUserDto);
      const createFarmDto: FarmCreateDto = { name: "Test Farm 1", address: "1 Market St." }
      const createdFarm = await farmService.createFarm(createFarmDto, createdUser)
      expect(createdUser).toBeInstanceOf(User);
      expect(createdFarm).toBeInstanceOf(Farm);
    })
  });

});
