import { Repository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { boundMethod } from "autobind-decorator";
import { User } from "modules/users/entities/user.entity";
import { decode } from "jsonwebtoken";
import { AccessToken } from "modules/auth/entities/access-token.entity";
import { failedAuthorizeToken, noTokenProvided } from "errors/errors"
import dataSource from "orm/orm.config";


class AuthMiddleware{
    private readonly accessTokenRepository: Repository<AccessToken>;
    private readonly userRepository: Repository<User>

    constructor() {
        this.accessTokenRepository = dataSource.getRepository(AccessToken);
        this.userRepository = dataSource.getRepository(User)
    }

    private async verifyUser(token: string): Promise<null | Promise<User>>{
        const accessToken = await this.accessTokenRepository.findOneBy({ token })
        if(!accessToken){
            return null
        }
        const decoded = decode(token) as User
        if(!decoded){
            return null
        }
        return this.userRepository.findOneBy({ id: decoded.id })
    }

    @boundMethod
    async verifyToken(req: Request, _: Response, next: NextFunction){
        const token = req.headers.authorization ? req.headers.authorization.replace("Bearer", "").trim() : null
        if (!token) {
            return next(noTokenProvided)
        }
        const user = await this.verifyUser(token)
        if(!user){
            return next(failedAuthorizeToken)
        }
        Object.assign(req, { user })
        return next()
    }
}

const authMiddleware = new AuthMiddleware()

export {
    authMiddleware
}
