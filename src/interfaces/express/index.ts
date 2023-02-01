import {Request as Req} from "express";
import {User} from "modules/users/entities/user.entity";

export interface Request extends Req {
  user?: User;
}
