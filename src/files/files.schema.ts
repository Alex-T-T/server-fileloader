import Joi from 'joi';

export const getAllQuerySchema = Joi.object<{ limit: number; page: number, search?: string| undefined }>({
    limit: Joi.number().required(),
    page: Joi.number().required(),
    search: Joi.string().allow('').allow(null).optional()

});
