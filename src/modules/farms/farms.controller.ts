import { boundMethod } from "autobind-decorator";
import { Response } from "express";
import { Request } from "interfaces/express"
import { FarmCreateDto } from "./dto/farm-create.dto"
import { FarmsService } from "./farms.service";


export class FarmsController {
  private readonly farmService: FarmsService
  constructor() {
    this.farmService = new FarmsService()
  }

  @boundMethod
  public async create(req: Request, res: Response) {
    const farmData = await this.farmService.createFarm(
      req.body as FarmCreateDto,
      req.user!
    )
    res.status(201).send(farmData)
  }

  @boundMethod
  public async delete(req: Request, res: Response) {
    const { farmId } = req.params
    await this.farmService.deleteFarm(
      farmId,
      req.user!
    )
    res.status(204).send()
  }
}
