import { Request, Response } from "express";
import connectDb from "../db/index";
// export const registerUser = async (req: Request, res: Response): Promise<void> => {
//   const { name, middle, lastname, month, day, year, gender, address, contact, email, password } = req.body;

//   try {
//     const existingUser = await prisma.tbl_user.findUnique({
//       where: { email },
//     });

//     if (existingUser) {
//       res.status(400).json({ message: "Email already exists" });
//       return;
//     }
    
//     await prisma.tbl_user.create({
//       data: {
//         name,
//         middle,
//         lastname,
//         month,
//         day,
//         year,
//         gender,
//         address,
//         contact,
//         email,
//         password, 
//       },
//     });

//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     console.error("Error during user registration:", error);
//     res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// };
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  try {
    const connection = await connectDb();
    const [users] = await connection.execute<any[]>(
      "SELECT * FROM tbl_user WHERE email = ? AND password = ?",
      [email, password]
    );

    if (users.length === 0) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const user = users[0];

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const checkAuth = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.query;

  try {
    const connection = await connectDb();
    const [users] = await connection.execute<any[]>(
      "SELECT id, name, email FROM tbl_user WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    res.status(200).json(users[0]);
  } catch (error) {
    console.error("Check auth error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


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
        
       const [result]: any = await connection.execute(
        "INSERT INTO tbl_user (name, middle, lastname, month, day, year, gender, address, contact, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [name, middle, lastname, month, day, year, gender, address, contact, email, password]
      );
      const insertedId = result.insertId;
      res.status(201).json({ message: "User registered successfully", 
        user: {
          id: insertedId,
          name,
          middle,
          lastname,
          month,
          day,
          year,
          gender,
          address,
          contact,
          email
          
        }

      });
        
    } catch (error) {
      console.error("Error during user registration:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };

export const getAllUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const connection = await connectDb();
    const [users] = await connection.execute<any[]>("SELECT * FROM tbl_user");

   res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
   res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const getId = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;

    if (!id) {
      res.status(400).json({ success: false, message: "Invalid ID" });
      return;
    }

    const connection = await connectDb();
    const [data]: [any[], any] = await connection.execute("SELECT * FROM tbl_user WHERE id = ?", [id]);

    if (data.length === 0) {
      res.status(404).json({ success: false, message: "No records found" });
      return;
    }

    res.status(200).json({ success: true, userDetails: data[0] });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ success: false, message: "Error in getting user by ID", error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;

      if (!id) {
        res.status(500).json({
          success: false,
          message: "failed to delete"
        });
        return;
      }
      const connection = await connectDb();
      const [result]: any = await connection.execute("DELETE FROM `tbl_user` WHERE id = ?", [id]);
      if (result.affectedRows === 0) {
        res.status(500).json({
          success: false,
          message: "record cant found"
        });
        return;
      }
      res.status(200).json({ success: true, message: "successfull deleted" });
    } catch (error) {
      console.error("error cant delete", error);
      res.status(500).json({
        message: "server error", error: error.message
      });
    }
};

export const updateId = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;

    const connection = await connectDb();
    const [result]: any = await connection.execute(
      "UPDATE tbl_user SET name = ? WHERE id = ?",
      [name, id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({
        success: false,
        message: "User not found"
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User name updated successfully"
    });
  } catch (error) {
    console.error("Failed to update user name:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
