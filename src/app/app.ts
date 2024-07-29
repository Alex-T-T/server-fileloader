import express from 'express';
import logger from 'morgan';
import cors from 'cors';

import path from 'path';
import { AppDataSource } from '../db/data-source';
import filesRouter from '../files/files.router';
import exeptionsFilter from './middlewares/exception.filter';
import suggestionsRouter from '../suggestions/suggestions.router';

const app = express();

const UI_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : process.env.UI_URL 

app.use(logger('dev'));
app.use(cors( {origin: UI_URL}));

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '7gb', extended: true }));

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
app.use('/api/v1/search-suggestions', suggestionsRouter);


app.use(exeptionsFilter);
export default app;
