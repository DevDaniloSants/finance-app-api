import express from 'express';
import 'dotenv/config';

const app = express();

app.use(express.json());

const port = process.env.PORT;

app.listen(port, () => console.log(`listening to port ${port}`));
