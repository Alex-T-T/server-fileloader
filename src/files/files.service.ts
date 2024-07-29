import { ManagedUpload } from 'aws-sdk/clients/s3';
import { AppDataSource } from '../db/data-source';
import { File } from './files.entity';
import path from 'path';
import HttpException from '../app/exceptions/http-exception';
import { HttpStatuses } from '../app/enums/http-statuses.enum';
import { DeleteResult, ILike } from 'typeorm';

const filesRepository = AppDataSource.getRepository(File);

export type FileDTO = {
    name: string;
    description: string;
    downloads?: number | undefined;
    size: number;
    extention: string;
    aws_key: string;
};

// GET Services ================================
export const getAllFiles = async (limit: number, page: number, search?: string | undefined) => {
    const skip = limit * (page - 1);

    const queryOptions: any = {
        skip: skip,
        take: limit,
        select: ['id', 'name', 'description', 'downloads', 'size', 'extention'],
    };

    if (search) {
        queryOptions.where = {
            name: ILike(`%${search}%`),
        };
    }

    const [files, total] = await filesRepository.findAndCount(queryOptions);

    return { files, total };
};

export const getFileById = async (id: number) => {
    const fileData = await filesRepository.findOneBy({ id });

    return fileData;
};

export const getFileByName = async (name: string) => {
    const fileData = await filesRepository.findOneBy({ name });

    return fileData;
};

export const getNameSuggestions = async (query: string) => {
    console.log('query: ', query);

    const queryOptions: any = {
        select: [ 'name' ],
        where: {
            name: ILike(`%${query}%`),
        }
    };

    const suggestions = await filesRepository.find(queryOptions);

    return suggestions
}

// POST Services =================================

export const createNewFile = async (
    file: Express.Multer.File,
    properties: ManagedUpload.SendData,
    title: string, 
    description: string
) => {
    const fileExtension = path.extname(file.originalname);

    const fileData: FileDTO = {
        name: title,
        description,
        downloads: 0,
        size: file.size,
        aws_key: properties.Key,
        extention: fileExtension,
    };

    const createdFile = filesRepository.create(fileData);

    const res = await filesRepository.save(createdFile);

    return res;
};

// PUT, PATCH Services =============================
export const updateDownloadCounter = async (id: number) => {
    const existingFile = await getFileById(id);

    if (!existingFile)
        throw new HttpException(HttpStatuses.NOT_FOUND, 'File not found');

    const updatedFile = await filesRepository.save({
        ...existingFile,
        downloads: existingFile.downloads + 1,
    });

    return updatedFile;
};

// DELETE Services ==============================
export const deleteFileById = async (id: number) => {
    const existingFile = await getFileById(id);

    if (!existingFile)
        throw new HttpException(HttpStatuses.NOT_FOUND, 'File not found');

    const res: DeleteResult = await filesRepository.delete({
        id: existingFile.id,
    });

    return res;
};
