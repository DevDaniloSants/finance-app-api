import express from 'express';
import 'dotenv/config';

import {
    makeCreateTransactionController,
    makeGetTransactionsByUserIdController,
    makeUpdateTransactionController,
    makeDeleteTransactionController,
} from './src/factories/controllers/index.js';

import { usersRouter } from './src/routes/users.js';

const app = express();

const port = process.env.PORT;

app.use(express.json());

app.use('/api/users', usersRouter);

app.get('/api/transactions', async (request, response) => {
    const getTransactionsByUserController =
        makeGetTransactionsByUserIdController();

    const { statusCode, body } =
        await getTransactionsByUserController.execute(request);

    response.status(statusCode).send(body);
});

app.post('/api/transactions', async (request, response) => {
    const createTransactionController = makeCreateTransactionController();

    const { statusCode, body } =
        await createTransactionController.execute(request);

    response.status(statusCode).send(body);
});

app.patch('/api/transactions/:transactionId', async (request, response) => {
    const updateTransactionController = makeUpdateTransactionController();

    const { statusCode, body } =
        await updateTransactionController.execute(request);

    response.status(statusCode).send(body);
});

app.delete('/api/transactions/:transactionId', async (request, response) => {
    const deleteTransactionController = makeDeleteTransactionController();

    const { statusCode, body } =
        await deleteTransactionController.execute(request);

    response.status(statusCode).send(body);
});

app.listen(port, () => console.log(`listening to port ${port}`));
