import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { body, validationResult } from 'express-validator';

import { json } from 'express';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(json());

const connectDB = async () => {
    return await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
}

let db;
connectDB().then(connection => {
    db = connection;
}).catch(error => {
    console.error("connection error", error);
});

app.post(
    '/supplier',
    [
        body('sup_name').notEmpty().withMessage('name is required'),
        body('sup_contact').notEmpty().withMessage('contact required'),
        body('sup_email').notEmpty().withMessage('emial is requird'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { sup_name, sup_contact, sup_email } = req.body;

        try {
            console.log("adding supplier request:", req.body);
                if (!db) {
                    console.error("database is not connected");
                    return res.status(500).json({ message: "database is not connected"});
                }

                    const [rows] = await db.execute('SELECT * FROM tbl_supplier WHERE sup_email = ?', [sup_email])
                    if (rows.length > 0){
                        return res.status(400).json({ message: "email already exist"});
                    }


                    await db.execute('INSERT INTO tbl_supplier (sup_name, sup_contact, sup_email) VALUES (?, ?, ?)',
                        [sup_name, sup_contact, sup_email]);
                        res.status(400).json({ message: "supplier addes"});

        } catch (error) {
            console.error("database error:", error);
            res.status(500).json({ message: 'server error', error: error.message });
        }

        }


);
app.listen(PORT, () => {
    console.log(`server started at port ${PORT}`)
});