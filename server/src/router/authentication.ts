import express from 'express';
// import { registerUser } from '../controllers/authentication';
import { registerUser, getAllUser, getId, deleteUser, updateId } from '../controllers/authentication';
import { addSupplier } from '../controllers/supplier';



const router = express.Router();

router.post('/', registerUser);
router.post('/addSupplier', addSupplier);
router.get('/users', getAllUser);
router.get('/get/:id', getId);
router.delete('/delete/:id', deleteUser)
router.put('/update/:id', updateId)
export default router;
