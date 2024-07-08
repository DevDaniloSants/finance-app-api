import express from 'express';
import 'dotenv/config';

import {
    CreateUserController,
    GetUserByIdController,
    UpdateUserController,
} from './src/controller/index.js';

import { GetUserByIdUseCase } from './src/use-cases/get-user-by-id.js';
import { GetUserByIdRepository } from './src/repositories/postgres/get-user-by-id.js';

const app = express();

const port = process.env.PORT;

app.use(express.json());

app.post('/api/users', async (request, response) => {
    const createUserController = new CreateUserController();

    const { statusCode, body } = await createUserController.execute(request);

    response.status(statusCode).send(body);
});

app.patch('/api/users/:userId', async (request, response) => {
    const updatedUserControler = new UpdateUserController();

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

app.listen(port, () => console.log(`listening to port ${port}`));
