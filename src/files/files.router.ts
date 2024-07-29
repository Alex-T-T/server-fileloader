import express from 'express';
import controllerWrapper from '../app/utils/controller-wrapper';
import * as filesController from './files.controller';
import validator from '../app/middlewares/validation.middleware';
import multer from 'multer';
import { idParamSchema } from '../app/schemas/id-param.schema';
import { getAllQuerySchema } from './files.schema';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.get(
    '/',
    validator.query(getAllQuerySchema),
    controllerWrapper(filesController.getAllFiles)
);

router.get(
    '/:id',
    validator.params(idParamSchema),
    controllerWrapper(filesController.getFileById)
);

router.post(
    '/',
    upload.single('file'),
    controllerWrapper(filesController.createNewFile)
);

router.delete(
    '/:id',
    validator.params(idParamSchema),
    controllerWrapper(filesController.deleteFileById)
);

export default router;
