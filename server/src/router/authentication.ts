import express from 'express';
import { registerUser } from '../controllers/authentication';

const router = express.Router();

router.post('/', registerUser);

export default router;
