import { Repository } from "typeorm";
import { generateError } from "errors/errors";
import { FarmCreateDto } from "./dto/farm-create.dto";
import { Farm } from "./entities/farm.entity";
import { getAddressData } from "../../helpers/google-maps";
import { User } from "modules/users/entities/user.entity";
import dataSource from "orm/orm.config";

export class FarmsService {
  private readonly farmRepository: Repository<Farm>;

  constructor() {
    this.farmRepository = dataSource.getRepository(Farm);
  }

  public async createFarm(data: FarmCreateDto, user: User): Promise<Farm> {
    const {address, name, yieldValue, size} = data
    if (!address) {
      throw generateError("Address is required", 400)
    }
    const addressData = await getAddressData(address)
    if (!addressData) {
      throw generateError("Cant find address", 400)
    }
    const {lat, lng} = addressData.coordinates

    const farmData = this.farmRepository.create({
      user: user,
      address,
      name,
      yield: yieldValue,
      size,
      coordinates: `(${lng}, ${lat})`
    })

    return this.farmRepository.save(farmData)
  }

  public async deleteFarm(farmId: string, user: User) {

    const farmToUpdate = await this.farmRepository.findOne({
      select: ["id", "deleted"],
      where:{
        id: farmId,
        userId: user.id,
        deleted: false
      }
    })
    if (!farmToUpdate) {
      throw generateError("Farm not found", 404)
    }
    farmToUpdate.deleted = true
    return this.farmRepository.save(farmToUpdate)
  }

}
