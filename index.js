import express from 'express';
import 'dotenv/config';

import { CreateUserController } from './src/controller/create-user.js';

const app = express();

const port = process.env.PORT;

app.use(express.json());

app.post('/api/users', async (request, response) => {
    const createUserController = new CreateUserController();

    const { statusCode, body } = await createUserController.execute(request);

    response.status(statusCode).send(body);
});

app.listen(port, () => console.log(`listening to port ${port}`));
