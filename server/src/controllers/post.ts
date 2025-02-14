import { Request, Response } from "express";
import connectDb from "../db/index";

export const createPost = async (req: Request, res: Response): Promise<void> => {
    try {
      const { user_id, post, image } = req.body;
      
      if (!user_id) {
        res.status(400).json({ 
          success: false, 
          message: "User ID is required" 
        });
        return;
      }
  
      if (!post || !post.trim()) {
        res.status(400).json({ 
          success: false, 
          message: "Post content cannot be empty" 
        });
        return;
      }

    const connection = await connectDb();

    const [users] = await connection.execute<any[]>(
      "SELECT id, name FROM tbl_user WHERE id = ?",
      [user_id]
    );

    if (users.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found"
      });
      return;
    }
    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const [result]: any = await connection.execute(
      "INSERT INTO tbl_post (user_id, post, image, created_at) VALUES (?, ?, ?, ?)",
      [user_id, post, image || null, created_at]
    );

    if (result.affectedRows > 0) {
      res.status(201).json({
        success: true,
        message: "Post created successfully",
        data: {
          id: result.insertId,
          user_id,
          user_name: users[0].name,
          post,
          image: image || null,
          created_at
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to create post"
      });
    }

  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const GetallPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const connection = await connectDb();
            const [post] = await connection.execute<any[]>("SELECT * FROM tbl_post")
            
            res.status(201).json(post)
    } catch (error) {
        console.error("get all post is error", error)
        res.status(500).json({
            message: "server error", error: error.message
        });
    }
};