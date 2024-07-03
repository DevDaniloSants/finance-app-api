import express from 'express';
import 'dotenv/config';

import { CreateUserController } from './src/controller/create-user.js';
import { GetByUserIdController } from './src/controller/get-by-user-id.js';

const app = express();

const port = process.env.PORT;

app.use(express.json());

app.post('/api/users', async (request, response) => {
    const createUserController = new CreateUserController();

    const { statusCode, body } = await createUserController.execute(request);

    response.status(statusCode).send(body);
});

app.get('/api/users/:userId', async (request, response) => {
    const getByUserIdController = new GetByUserIdController();

    const { statusCode, body } = await getByUserIdController.execute(request);

    response.status(statusCode).send(body);
});

app.listen(port, () => console.log(`listening to port ${port}`));
