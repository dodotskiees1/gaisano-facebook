import express from 'express';
// import { registerUser } from '../controllers/authentication';
import { registerUser, getAllUser, getId, deleteUser, updateId, loginUser, checkAuth } from '../controllers/authentication';
import { addSupplier } from '../controllers/supplier';
import { Validator } from "../middlewares/validation";
import { userSchema } from "../controllers/middlewares/uservalidation";
const router = express.Router();
const validatorUser = new Validator().execute(userSchema);
router.post("/register", validatorUser, registerUser);
router.post("/login", loginUser);
router.get("/check-auth", checkAuth);
router.post('/addSupplier', addSupplier);
router.get('/users', getAllUser);
router.get('/get/:id', getId);
router.delete('/delete/:id', deleteUser)
router.put('/update/:id', updateId) 
export default router;
