const { DataSource } = require("typeorm")
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt')
const { config: envConfig } = require("dotenv")
const path = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
const { parsed } = envConfig({ path });
const dataSource = new DataSource({
  host: parsed.DB_HOST,
  port: parsed.DB_PORT,
  username: parsed.DB_USERNAME,
  password: parsed.DB_PASSWORD,
  database: parsed.DB_NAME,
  synchronize: true,
  type: "postgres"
})

const NUMBER_OF_USERS = 4
const NUMBER_OF_FARMS = 30

const hashPassword = async (password, saltRounds = parsed.SALT_ROUNDS) => {
  const salt = await bcrypt.genSalt(parseInt(saltRounds));
  return bcrypt.hash(password, salt);
}

const createFarm = async (queryRunner, user) =>{
  const farmName = faker.random.word()
  const farmAddress = faker.address.streetAddress(true)
  const coordinates = faker.address.nearbyGPSCoordinate([37.6000, -95.6650], 3881, true)
  const [lat, lng] = coordinates
  const size =  faker.random.numeric(2)
  const yield =  faker.random.numeric(1)
  return queryRunner.query(
    `INSERT INTO "farm" ("userId", "name", "address", "coordinates", "size", "yield") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [user.id, farmName, farmAddress, `(${lng}, ${lat})`, size, yield]
  )

}

const createUserAndFarms = async (queryRunner) => {
  for(let i = 0; i < NUMBER_OF_USERS; i++){
    const email = faker.internet.email()
    const password = await hashPassword(email.split('@')[0].toLowerCase())
    const [user] = await queryRunner.query('INSERT INTO "user" ("email", "hashedPassword") VALUES ($1, $2) RETURNING *', [email, password])
    for(let x = 0; x  < NUMBER_OF_FARMS; x++){
        await createFarm(queryRunner, user)
    }
  }
}


async function run(){
  await dataSource.initialize()
  const queryRunner = await dataSource.createQueryRunner();
  await createUserAndFarms(queryRunner)
}

run()
.then(()=>{
  process.exit(0)
})
.catch((error)=>{
  console.error(error)
  process.exit(1)
})
