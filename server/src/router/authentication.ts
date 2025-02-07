import express from 'express';
import { registerUser } from '../controllers/authentication';
import { addSupplier } from '../controllers/authentication';

const router = express.Router();

router.post('/', registerUser);
router.post('/', addSupplier);

export default router;
