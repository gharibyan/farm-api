import { Repository } from "typeorm";
import { generateError } from "errors/errors";
import { FarmCreateDto } from "./dto/farm-create.dto";
import { Farm, FarmWithDistance } from "./entities/farm.entity";
import { getAddressData, getDistance, AddressResponse, Coordinates } from "../../helpers/google-maps";
import { User } from "modules/users/entities/user.entity";
import dataSource from "orm/orm.config";

export class FarmsService {
  private readonly farmRepository: Repository<Farm>;

  constructor() {
    this.farmRepository = dataSource.getRepository(Farm);
  }

  private async transformFarms(farms: Array<FarmWithDistance>, address?:string, outlined?:boolean){
    let addressData = null as null | AddressResponse
    if(address){
      addressData = await getAddressData(address)
      if(addressData){
        await Promise.all(farms.map(async (farm: FarmWithDistance) => {
          const { x, y } = farm.coordinates!
          farm.distance = await getDistance(
            addressData!.coordinates,
            { lat: y, lng: x }
          )
          delete farm.coordinates
          return farm
        }))
      }
    }
    farms = farms.map((farm)=>{
      farm.owner = farm.user!.email
      delete farm.user
      return farm
    }).sort((a:FarmWithDistance, b:FarmWithDistance)=> {
      const distanceA = (a.distance != null ? a.distance.value : Infinity)
      const distanceB = (b.distance != null ? b.distance.value : Infinity)
      return distanceA - distanceB
    })

    if(outlined){
      const total = farms.reduce((a, b) => a + b.yield, 0)
      const avg =  total / farms.length
      farms = farms.filter(farm => {
        const percentage = 100 * farm.yield / avg
        return percentage < 30 || percentage > avg
      })
    }

    return farms
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
    const {lat, lng} = addressData.coordinates as Coordinates

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

  public async getFarms(data: {
    outlined?: boolean,
    address?: string
  }): Promise<Array<FarmWithDistance>>{
    const { address, outlined } = data
    const farms = await this.farmRepository.find({
      relations: {
        user: true
      },
      select: {
          user:{
            email: true
          },
          coordinates: true,
          name: true,
          address: true,
          size: true,
          yield: true,
          createdAt: true,
      },
      where:{
        deleted: false
      },
      order: {
        name: "ASC",
        createdAt: "DESC",
      },
    })
    return this.transformFarms(farms as Array<FarmWithDistance>, address, outlined)
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
