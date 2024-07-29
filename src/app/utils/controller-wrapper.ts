import { NextFunction, Request, Response } from 'express';

const controllerWrapper = (reqHandler: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await reqHandler(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};

export default controllerWrapper;
