import 'dotenv/config';

import { app } from './src/app.js';

const port = process.env.PORT;

app.listen(port, () => console.log(`listening to port ${port}`));
