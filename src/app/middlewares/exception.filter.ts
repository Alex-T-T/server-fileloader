import { Request, Response, NextFunction } from 'express';
import HttpException from '../exceptions/http-exception';
import { HttpStatuses } from '../enums/http-statuses.enum';

const exeptionsFilter = (
    error: HttpException,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const status = error.status || HttpStatuses.INTERNAL_SERVER_ERROR;
    const message = error.message || 'Something went wrong';
    res.status(status).send({ status, message });
};

export default exeptionsFilter;
