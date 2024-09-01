import express from 'express';
import 'dotenv/config';

import { usersRouter, transactionsRouter } from './src/routes/index.js';

const app = express();

const port = process.env.PORT;

app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/transactions', transactionsRouter);

app.listen(port, () => console.log(`listening to port ${port}`));
