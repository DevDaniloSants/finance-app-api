import express from 'express';
import 'dotenv/config';

import {
    makeCreateUserController,
    makeDeleteUserController,
    makeGetUserByIdController,
    makeUpdateUserController,
    makeCreateTransactionController,
    makeGetTransactionsByUserIdController,
    makeUpdateTransactionController,
    makeGetUserBalanceController,
    makeDeleteTransactionController,
} from './src/factories/controllers/index.js';

const app = express();

const port = process.env.PORT;

app.use(express.json());

app.post('/api/users', async (request, response) => {
    const createUserController = makeCreateUserController();

    const { statusCode, body } = await createUserController.execute(request);

    response.status(statusCode).send(body);
});

app.patch('/api/users/:userId', async (request, response) => {
    const updatedUserControler = makeUpdateUserController();

    const { statusCode, body } = await updatedUserControler.execute(request);

    response.status(statusCode).send(body);
});

app.get('/api/users/:userId', async (request, response) => {
    const getUserByIdController = makeGetUserByIdController();

    const { statusCode, body } = await getUserByIdController.execute(request);

    response.status(statusCode).send(body);
});

app.delete('/api/users/:userId', async (request, response) => {
    const deleteUserController = makeDeleteUserController();

    const { statusCode, body } = await deleteUserController.execute(request);

    response.status(statusCode).send(body);
});

app.get('/api/users/:userId/balance', async (request, response) => {
    const getUserBalanceController = makeGetUserBalanceController();

    const { statusCode, body } =
        await getUserBalanceController.execute(request);

    response.status(statusCode).send(body);
});

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
