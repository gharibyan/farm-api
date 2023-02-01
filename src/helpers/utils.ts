import { DataSource } from "typeorm";
import {NextFunction, Response} from "express";
import {Request} from "interfaces/express"

export const disconnectAndClearDatabase = async (ds: DataSource): Promise<void> => {
  const { entityMetadatas } = ds;

  await Promise.all(entityMetadatas.map(data => ds.query(`truncate table "${data.tableName}" cascade`)));
  await ds.destroy();
};


export const wrapAsyncHandler = (handler: Function) => {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await handler(req, res, next)
    } catch (err) {
      next(err)
    }
  }
}
