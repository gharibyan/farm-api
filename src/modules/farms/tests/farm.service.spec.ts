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
import { getAddressData, getDistance } from "../../../helpers/google-maps";
import config from "config/config";
import ds from "orm/orm.config";



jest.mock("../../../helpers/google-maps", () => ({
  getAddressData: jest.fn( (address: string) => {
    return  {
      address: address,
      coordinates: { lat: 10, lng: 20 }
    }
  }),
  getDistance: jest.fn( () => {
    return  {
      text: "100 km",
      value: 100
    }
  }),
}));

test("Check getAddressData is Mocked ", async () => {
  const addressResponse = await getAddressData("Some Address")
  expect(addressResponse?.address).toEqual("Some Address")
  expect(addressResponse?.coordinates).toEqual({ lat: 10, lng: 20 })
});

test("Check getDistance is Mocked ", async () => {
  const distanceResponse = await getDistance({lat: 10, lng:20}, {lat:10, lng:20})
  expect(distanceResponse?.text).toEqual("100 km")
  expect(distanceResponse?.value).toEqual(100)
});

describe("FarmService", () => {
  let app: Express;
  let server: Server;

  let farmService: FarmsService;
  let usersService: UsersService;

  beforeAll(async () => {
    app = setupServer();
    server = http.createServer(app).listen(config.APP_PORT);
    await ds.initialize();
    farmService = new FarmsService();
    usersService = new UsersService();
  });

  afterAll(async () => {
    server.close();
    await disconnectAndClearDatabase(ds);
  });

  describe("Should Delete Farm", () => {
    it("delete farm", async ()=>{
      const createUserDto: CreateUserDto = { email: "user2@test.com", password: "password" };
      const createdUser = await usersService.createUser(createUserDto);
      const createFarmDto: FarmCreateDto = { name: "Test Farm 1", address: "1 Market St." }
      const createdFarm = await farmService.createFarm(createFarmDto, createdUser)
      expect(createdUser).toBeInstanceOf(User);
      expect(createdFarm).toBeInstanceOf(Farm);
      await farmService.deleteFarm(createdFarm.id, createdUser)
      const farmsList = await farmService.getFarms({})
      expect(farmsList.length).toBe(0);
    })
  });

  describe("Should create, get farms", () => {
    it("should create new farm for user", async ()=>{
      const createUserDto: CreateUserDto = { email: "user@test.com", password: "password" };
      const createdUser = await usersService.createUser(createUserDto);
      const createFarmDto: FarmCreateDto = { name: "Test Farm 1", address: "1 Market St." }
      const createdFarm = await farmService.createFarm(createFarmDto, createdUser)
      expect(createdUser).toBeInstanceOf(User);
      expect(createdFarm).toBeInstanceOf(Farm);
    })
    it("should return farmsList", async ()=>{
      const farmsList = await farmService.getFarms({})
      expect(Array.isArray(farmsList)).toBe(true);
    })
    it("should return farmsList including distance", async ()=>{
      const farmsList = await farmService.getFarms({address: "test address"})
      expect(Array.isArray(farmsList)).toBe(true);
      expect(farmsList[0].distance!.text).toEqual("100 km")
      expect(farmsList[0].distance!.value).toEqual(100)
    })
  });

});
