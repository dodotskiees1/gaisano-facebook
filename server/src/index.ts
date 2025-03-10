import express from 'express';
import cors from 'cors';
import registrationRouter from './router/authentication';
import getAllUserRouter from './router/authentication';
import getIdRouter from './router/authentication';
import addSupplierRouter from './router/authentication';
import deleteUserRouter from './router/authentication';
import updateIdRouter from './router/authentication';
import authRouter from './router/authentication';
import createPostRouter from './router/authentication';
import GetAllPostRouter from './router/authentication';
import PostDeleteRouter  from './router/authentication';
import PostUpdateRouter  from  './router/authentication';
import path from 'path';
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(authRouter);
app.use('/registration', registrationRouter);
app.use('/createpost', createPostRouter);
app.use('/addSupplier', addSupplierRouter);
app.use('/PostDelete', PostDeleteRouter);
app.use('/images', express.static(path.join(__dirname, '../src/images')));
app.use('/getAlluser', getAllUserRouter)
app.use('/id', getIdRouter);
app.use('/delete', deleteUserRouter);
app.use('/update', updateIdRouter);
app.use('/api', GetAllPostRouter);
app.use('/UpdatePost', PostUpdateRouter);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
