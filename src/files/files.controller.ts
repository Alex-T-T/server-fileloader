import { Request, Response } from 'express';
import * as AWSService from '../services/AWS.service';
import * as filesService from './files.service';
import HttpException from '../app/exceptions/http-exception';
import { HttpStatuses } from '../app/enums/http-statuses.enum';
import {
    aesDecrypt,
    aesEncrypt,
    EncryptedData,
} from '../services/encription.service';

// GET Controllers ==============================

export const getAllFiles = async (
    req: Request,
    res: Response
): Promise<void> => {
    const limit = Number(req.query.limit) || 100;
    const page = Number(req.query.page) || 1;
    const search = req.query.search as string || ''

    const filesData = await filesService.getAllFiles(limit, page, search);

    res.status(200).json(filesData);
};

export const getFileById = async (
    req: Request,
    res: Response
): Promise<void> => {
    const id = +req.params.id;

    const fileData = await filesService.getFileById(id);

    if (!fileData)
        throw new HttpException(HttpStatuses.NOT_FOUND, 'File not found');

    const buffer = await AWSService.getFile(fileData);

    // Decrypt the file data
    const combinedData = buffer.toString('hex');
    const decryptedBuffer = aesDecrypt(combinedData);

    await filesService.updateDownloadCounter(id);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${fileData.name}${fileData.extention}"`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.status(200).send(decryptedBuffer);
};

// POST Controllers ==============================

export const createNewFile = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    const file = req.file;
    const { title, description } = req.body;

if (!title || !description)     throw new HttpException(
    HttpStatuses.BAD_REQUEST,
    `Title and description required`
);


const MIN_FILE_SIZE = 1 * 1024;
const MAX_FILE_SIZE = 7 * 1024 * 1024 * 1024;

if (file.size < MIN_FILE_SIZE || file.size > MAX_FILE_SIZE)    throw new HttpException(
    HttpStatuses.BAD_REQUEST,
    `Error: File size must be between 1 KB and 7 GB.`
);

    const existingFile = await filesService.getFileByName(title);

    if (existingFile)
        throw new HttpException(
            HttpStatuses.CONFLICT,
            `File with name ${title} already exist.`
        );

    // Encrypt the file buffer
    const { combinedData }: EncryptedData = aesEncrypt(file.buffer);

    const encryptedFile = {
        ...file,
        buffer: Buffer.from(combinedData, 'hex'), 
        originalname: file.originalname + '.enc',
    };

    const AWSUpload = await AWSService.uploadFile(encryptedFile);

    const newFile = await filesService.createNewFile(file, AWSUpload,title, description);


    res.status(201).json(newFile);
};

// DELETE Controllers ==============================

export const deleteFileById = async (
    req: Request<{ id: number }>,
    res: Response
): Promise<void> => {
    const id = +req.params.id;

    const existingFile = await filesService.getFileById(id);

    if (!existingFile)
        throw new HttpException(HttpStatuses.NOT_FOUND, 'File not found');

    await AWSService.deleteFile(existingFile);

    const removeFromDb = await filesService.deleteFileById(id);

    if (!removeFromDb.affected)
        throw new HttpException(
            HttpStatuses.INTERNAL_SERVER_ERROR,
            'Error deleting from Db'
        );
    res.status(204).json('No content');
};
