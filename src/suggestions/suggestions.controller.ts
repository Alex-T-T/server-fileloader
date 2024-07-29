import { Request, Response } from 'express';
import * as filesService from '../files/files.service';

// GET Controllers ==============================

export const getSuggestions = async (
    req: Request,
    res: Response
): Promise<void> => {

    const search = req.query.query as string || ''

    const suggestions = await filesService.getNameSuggestions(search);

    res.status(200).json(suggestions);
};