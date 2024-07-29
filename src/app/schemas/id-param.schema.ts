import Joi from 'joi';

export const idParamSchema = Joi.object<{ id: number }>({
    id: Joi.number().required(),
});
