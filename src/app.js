import express from 'express';
import fs from 'fs';
import path from 'path';

import { transactionsRouter, usersRouter } from './routes/index.js';

import swaggerUi from 'swagger-ui-express';

export const app = express();

app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/transactions', transactionsRouter);

const swaggerDocument = JSON.parse(
    fs.readFileSync(
        path.join(import.meta.dirname, '../docs/swagger.json'),
        'utf8',
    ),
);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
