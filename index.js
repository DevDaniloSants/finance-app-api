import express from 'express';
import 'dotenv/config';

import {
    CreateUserController,
    GetUserByIdController,
    UpdateUserController,
} from './src/controller/index.js';

import {
    CreateUserRepository,
    GetUserByEmailRepository,
    GetUserByIdRepository,
    UpdateUserRepository,
} from './src/repositories/postgres/index.js';

import {
    CreateUserUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
} from './src/use-cases/index.js';
import { DeleteUserController } from './src/controller/delete-user.js';
import { DeleteUserUseCase } from './src/use-cases/delete-user.js';
import { DeleteUserRepository } from './src/repositories/postgres/delete-user.js';

const app = express();

const port = process.env.PORT;

app.use(express.json());

app.post('/api/users', async (request, response) => {
    const getUserByEmailRepository = new GetUserByEmailRepository();

    const createUserRepository = new CreateUserRepository();

    const createUserUseCase = new CreateUserUseCase(
        getUserByEmailRepository,
        createUserRepository,
    );

    const createUserController = new CreateUserController(createUserUseCase);

    const { statusCode, body } = await createUserController.execute(request);

    response.status(statusCode).send(body);
});

app.patch('/api/users/:userId', async (request, response) => {
    const getUserByEmailRepository = new GetUserByEmailRepository();

    const updateUserRepository = new UpdateUserRepository();

    const updateUserUseCase = new UpdateUserUseCase(
        getUserByEmailRepository,
        updateUserRepository,
    );

    const updatedUserControler = new UpdateUserController(updateUserUseCase);

    const { statusCode, body } = await updatedUserControler.execute(request);

    response.status(statusCode).send(body);
});

app.get('/api/users/:userId', async (request, response) => {
    const getUserByIdRepository = new GetUserByIdRepository();

    const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository);

    const getUserByIdController = new GetUserByIdController(getUserByIdUseCase);

    const { statusCode, body } = await getUserByIdController.execute(request);

    response.status(statusCode).send(body);
});

app.delete('/api/users/:userId', async (request, response) => {
    const deleteUserRepository = new DeleteUserRepository();

    const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository);

    const deleteUserController = new DeleteUserController(deleteUserUseCase);

    const { statusCode, body } = await deleteUserController.execute(request);

    response.status(statusCode).send(body);
});

app.listen(port, () => console.log(`listening to port ${port}`));
