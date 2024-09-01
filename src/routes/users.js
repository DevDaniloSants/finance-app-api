import { Router } from 'express';
import {
    makeCreateUserController,
    makeDeleteUserController,
    makeGetUserBalanceController,
    makeGetUserByIdController,
    makeUpdateUserController,
} from '../factories/controllers/index.js';

export const usersRouter = Router();

usersRouter.post('/', async (request, response) => {
    const createUserController = makeCreateUserController();

    const { statusCode, body } = await createUserController.execute(request);

    response.status(statusCode).send(body);
});

usersRouter.patch('/:userId', async (request, response) => {
    const updatedUserControler = makeUpdateUserController();

    const { statusCode, body } = await updatedUserControler.execute(request);

    response.status(statusCode).send(body);
});

usersRouter.get('/:userId', async (request, response) => {
    const getUserByIdController = makeGetUserByIdController();

    const { statusCode, body } = await getUserByIdController.execute(request);

    response.status(statusCode).send(body);
});

usersRouter.delete('/:userId', async (request, response) => {
    const deleteUserController = makeDeleteUserController();

    const { statusCode, body } = await deleteUserController.execute(request);

    response.status(statusCode).send(body);
});

usersRouter.get('/:userId/balance', async (request, response) => {
    const getUserBalanceController = makeGetUserBalanceController();

    const { statusCode, body } =
        await getUserBalanceController.execute(request);

    response.status(statusCode).send(body);
});
