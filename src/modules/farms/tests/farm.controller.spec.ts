import { Express } from "express";
import http, { Server } from "http";
import supertest, { SuperAgentTest } from "supertest";
import { setupServer } from "server/server";
import { disconnectAndClearDatabase } from "helpers/utils";
import { CreateUserDto } from "../../users/dto/create-user.dto";
import { UsersService } from "../../users/users.service";
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

describe("FarmController", () => {
  let app: Express;
  let server: Server;
  let agent: SuperAgentTest;
  let usersService: UsersService;

  beforeAll(async () => {
    app = setupServer();
    server = http.createServer(app).listen(config.APP_PORT);
    await ds.initialize();
    agent = supertest.agent(app);
    usersService = new UsersService();
  });

  afterAll(async () => {
    server.close();
    await disconnectAndClearDatabase(ds);
  });
  let token = null as null | string
  let farmId = null as  null | string
  describe("Should Create Farm", () => {
    it("create authorize user and create farm", async ()=>{
      const createUserDto: CreateUserDto = { email: "user@test.com", password: "password" };
      await usersService.createUser(createUserDto);
      const authRes = await agent.post("/api/v1/auth/login").send(createUserDto);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      token = authRes.body.token as string
      expect(authRes.statusCode).toBe(201)
      expect(typeof token).toBe("string")

      const farmData = {
        name: "Farm 1",
        address: "'Beverly Hills"
      }
      const farmRes = await agent
        .post("/api/v1/farms")
        .set({ Authorization: `Bearer ${token}` })
        .send(farmData)

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      farmId = farmRes.body.id
      expect(farmRes.status).toBe(201)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(farmRes.body.name).toEqual(farmData.name)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(farmRes.body.address).toEqual(farmData.address)
    })
  });

  describe("Should Delete Farm", () => {
    it("create authorize user and create farm", async ()=>{
      const farmRes = await agent
        .delete(`/api/v1/farms/${farmId}`)
        .set({ Authorization: `Bearer ${token!}` })

      expect(farmRes.status).toBe(204)
    })
  });

});
