export interface AppError extends Error{
    status: number;
}

export class UnprocessableEntityError extends Error {}

export const generateError = ( text:string, status:number ) => {
    const error = new Error(text) as AppError
    error.status = status
    return error
}

export const noTokenProvided = generateError("No Token Provided", 401)

export const failedAuthorizeToken = generateError("Failed Authorize Token", 403)
