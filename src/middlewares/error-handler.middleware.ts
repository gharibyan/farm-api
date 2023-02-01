import { UnprocessableEntityError, AppError } from "errors/errors";
import { NextFunction, Request, Response } from "express";
import config from "config/config";

export function handleErrorMiddleware(error: AppError, _: Request, res: Response, next: NextFunction): void {
  const { message, status } = error;

  if(status && status >= 400 && status < 500){
    res.status(error.status).send({ message: error.message })
  }
  else if (error instanceof UnprocessableEntityError) {
    res.status(422).send({ name: "UnprocessableEntityError", message });
  } else {
    const response = {
      message: "Internal Server Error"
    }
    if(config.NODE_ENV === "localhost"){
        Object.assign(response, {error})
    }
    res.status(500).send(response);
  }

  next();
}
