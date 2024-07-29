import express from 'express';
import logger from 'morgan';
import cors from 'cors';

import path from 'path';
import { AppDataSource } from '../db/data-source';
import filesRouter from '../files/files.router';
import exeptionsFilter from './middlewares/exception.filter';

const app = express();

app.use(logger('dev'));
app.use(cors());

app.use(express.json());

AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
    })
    .catch((err) => {
        console.error('Error during Data Source initialization', err);
    });

const staticFilesPath = path.join(__dirname, '../', 'public');
app.use('/api/v1/public', express.static(staticFilesPath));

app.use('/api/v1/files', filesRouter);

app.use(exeptionsFilter);
export default app;
