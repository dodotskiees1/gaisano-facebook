import { Request, Response } from "express";
import connectDb from "../db/index";
import path from 'path';


export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, post } = req.body;
    let imagePath = null;
    
    if (req.file) {
      // Store the path in the database starting with /images/
      imagePath = `/images/${req.file.filename}`;
    }
    
    // ... rest of your validation code ...

    const connection = await connectDb();
    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const [result]: any = await connection.execute(
      "INSERT INTO tbl_post (user_id, post, image, created_at) VALUES (?, ?, ?, ?)",
      [user_id, post, imagePath, created_at]
    );

    // Get user information
    const [users] = await connection.execute<any[]>(
      "SELECT name FROM tbl_user WHERE id = ?",
      [user_id]
    );

    if (result.affectedRows > 0) {
      res.status(201).json({
        success: true,
        message: "Post created successfully",
        data: {
          id: result.insertId,
          user_id,
          user_name: users[0]?.name,
          post,
          image: imagePath ? `http://localhost:8080${imagePath}` : null,
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
    const [posts] = await connection.execute<any[]>(
      `SELECT p.*, u.name, u.middle, u.lastname 
       FROM tbl_post p 
       JOIN tbl_user u ON p.user_id = u.id 
       ORDER BY p.created_at DESC`
    );

    // Add the server URL to image paths
    const postsWithFullImageUrls = posts.map(post => ({
      ...post,
      image: post.image ? `http://localhost:8080${post.image}` : null
    }));

    res.status(200).json(postsWithFullImageUrls);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};