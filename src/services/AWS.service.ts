import AWS from 'aws-sdk';
import { File } from '../files/files.entity';
import HttpException from '../app/exceptions/http-exception';
import { HttpStatuses } from '../app/enums/http-statuses.enum';

// AWS Config ================================
const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucketName: process.env.S3_BUCKET_NAME!,
};

const s3 = new AWS.S3({
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey,
    region: awsConfig.region,
});

// GET Service ==============================
export const getFile = async (fileData: File) => {
    const params = {
        Bucket: awsConfig.bucketName,
        Key: fileData.aws_key,
    };

    const data = await s3.getObject(params).promise();

    if (!data)
        throw new HttpException(
            HttpStatuses.INTERNAL_SERVER_ERROR,
            'Error retrieving file from S3'
        );

    return data.Body as Buffer;
};

// POST Service ==============================
// export const uploadFile = async (file: Express.Multer.File) => {
//     const params = {
//         Bucket: awsConfig.bucketName,
//         Key: Date.now() + '-' + file.originalname,
//         Body: file.buffer,
//         ContentType: file.mimetype,
//     };

//     return s3.upload(params).promise();
// };

export const uploadFile = async (file: Express.Multer.File) => {
    const options = { partSize: 10 * 1024 * 1024, queueSize: 4 };

    const params = {
        Bucket: awsConfig.bucketName,
        Key: Date.now() + '-' + file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    return s3.upload(params, options).promise();
};

// DELETE Service ==============================
export const deleteFile = async (fileData: File) => {
    const params = {
        Bucket: awsConfig.bucketName,
        Key: fileData.aws_key,
    };

    const res = await s3.deleteObject(params).promise();

    if (!res)
        throw new HttpException(
            HttpStatuses.INTERNAL_SERVER_ERROR,
            'Error deleting file from S3'
        );

    return res;
};
