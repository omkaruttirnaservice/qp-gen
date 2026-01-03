import dotenv from 'dotenv';
dotenv.config();
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

// CORS setup with dynamic origin checking
const corsOptions = {
    origin: function (origin, callback) {
        console.log(origin, '=origin');
        // Allow requests with no origin (like mobile apps, curl)
        if (!origin) return callback(null, true);

        if (origin.includes('uttirna.in') || origin.includes('localhost') || origin.includes('192.168.1.5')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // allow cookies or auth headers
};

app.use(cors(corsOptions));

app.use(express.static('public'));

app.use(upload());

app.use(json({ limit: '1024mb' }));
app.use(urlencoded({ extended: true, limit: '1024mb' }));
app.use(cookieParser());

sequelize
    .authenticate()
    .then()
    .catch((err) => console.log(err, '==1=======database connection======================err=='));

app.get('/', (req, res) => {
    res.send('API is running....');
});

app.use('/api', indexRoutes);

import legacyRoutes from './routes/remoteRouterLegacy.js';
app.use('/gov', legacyRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log('Server started on', process.env.PORT);
});
