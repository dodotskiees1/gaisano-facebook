import express from 'express';
import cors from 'cors';
import connectDb from './db';
import registrationRouter from './router/authentication';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.use('/registration', registrationRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
