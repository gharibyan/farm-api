import { Request, Response } from "express";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { UserDto } from "../auth/dto/user.dto";
import { boundMethod } from "autobind-decorator"


export class UsersController {
  private readonly usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  @boundMethod
  public async create(req: Request, res: Response) {
    const user = await this.usersService.createUser(req.body as CreateUserDto);
    res.status(201).send(UserDto.createFromEntity(user));
  }
}
