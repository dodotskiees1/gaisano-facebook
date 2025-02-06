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
};
let db;
    connectDB().then(connection => {
        db =connection;
    }).catch(error => {
        console.error("Connection fail:", error);
    });

    app.post(
        '/admin',
        [
            body('admin_username').notEmpty().withMessage('name is requied'),
            body('password').notEmpty().withMessage('password is required'),
        ],

            async (req, res) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ erros: errors.array() });
                }
                const { admin_username, password } = req.body;
                    try {
                        console.log('Adding request:', req.body);

                        if (!db) {
                            console.error("database is not connected");
                            return res.status(400).json({ message: 'database error'});
                        }

                        const [row] = await db.execute('SELECT * FROM tbl_admin WHERE admin_username = ?', [admin_username]);
                        if (row.length > 0) {
                            return res.status(400).json({ message: 'Username already exist'});
                        }

                        await db.execute('INSERT INTO tbl_admin (admin_username, password) VALUES (?, ?)',
                            [admin_username, password]);

                            res.status(201).json({message: 'user added'});

                    } catch (error) {
                        console.error("database error:", error);
                        res.status(500).json({ message: 'server error', error: error.message});
                    }

            }

    );

    app.listen(PORT, () => {
        console.log(`server started at port ${PORT}`);
    });
