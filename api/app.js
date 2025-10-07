import dotenv from 'dotenv';
import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import upload from 'express-fileupload';
import indexRoutes from './routes/indexRoutes.js';
import cors from 'cors';
import sequelize from './application/config/db-connect-migration.js';
import { errorHandler } from './middlewares/errorMiddleware.js';
import morgan from 'morgan';

const app = express();

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

dotenv.config();
app.use(express.static('public'));

app.use(upload());
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    })
);

app.use(json({ limit: '1024mb' }));
app.use(urlencoded({ extended: true, limit: '1024mb' }));
app.use(cookieParser());

sequelize
    .authenticate()
    .then()
    .catch((err) => console.log(err, '==1=======database connection======================err=='));

app.use('/api', indexRoutes);

import legacyRoutes from './routes/remoteRouterLegacy.js';
app.use('/gov', legacyRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log('Server started on', process.env.PORT);
});
