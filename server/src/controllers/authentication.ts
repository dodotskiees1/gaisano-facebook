import { Request, Response } from "express";
import connectDb from "../db/index"; 

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { name, middle, lastname, month, day, year, gender, address, contact, email, password } = req.body;
  
    if (!name || !lastname || !email || !password) {
      res.status(400).json({ message: "Required fields are missing" });
      return;
    }
  
    try {
      const connection = await connectDb();
      const [existingUsers] = await connection.execute<any[]>(
        "SELECT email FROM tbl_user WHERE email = ?",
        [email]
      );
  
      if (existingUsers.length > 0) {
        res.status(400).json({ message: "Email already exists" });
        return;
      }
  
      await connection.execute(
        "INSERT INTO tbl_user (name, middle, lastname, month, day, year, gender, address, contact, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [name, middle, lastname, month, day, year, gender, address, contact, email, password]
      );
  
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error during user registration:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };
  
  