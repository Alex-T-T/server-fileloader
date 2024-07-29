import express from 'express';
import controllerWrapper from '../app/utils/controller-wrapper';
import * as suggestionsController from './suggestions.controller'


const router = express.Router();

router.get(
    '/',
    controllerWrapper(suggestionsController.getSuggestions)
);


export default router;
