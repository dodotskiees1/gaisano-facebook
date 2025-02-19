import { Request, Response } from "express";
import connectDb from "../db/index";
import path from 'path';
import { RowDataPacket } from 'mysql2';
interface PostRow extends RowDataPacket {
  id: number;
  user_id: number;
  post: string;
  image: string | null;
  created_at: string;
  name: string;
  middle: string | null;
  lastname: string;
}

interface PostWithImages extends Omit<PostRow, 'image'> {
  images: string[];
}
interface MulterRequest extends Request {
  files?: Express.Multer.File[];
}

export const createPost = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    const { user_id, post } = req.body;
    let imagePaths: string[] = [];
    
    // Check if files exist and handle multiple files
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map(file => `/images/${file.filename}`);
    }
    
    const connection = await connectDb();
    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Join the image paths with a delimiter
    const imagePathString = imagePaths.length > 0 ? imagePaths.join(';') : null;

    const [result]: any = await connection.execute(
      "INSERT INTO tbl_post (user_id, post, image, created_at) VALUES (?, ?, ?, ?)",
      [user_id, post, imagePathString, created_at]
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
          images: imagePaths.length > 0 
            ? imagePaths.map(path => `http://localhost:8080${path}`)
            : [],
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
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const GetallPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const connection = await connectDb();
    const [posts] = await connection.execute<PostRow[]>(
      `SELECT p.*, u.name, u.middle, u.lastname 
       FROM tbl_post p 
       JOIN tbl_user u ON p.user_id = u.id 
       ORDER BY p.created_at DESC`
    );

    const postsWithFullImageUrls: PostWithImages[] = posts.map((post) => ({
      ...post,
      images: post.image && post.image.length > 0
        ? post.image.split(';').map((img: string) => `http://localhost:8080${img}`)
        : []
    }));

    res.status(200).json(postsWithFullImageUrls);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const PostDelete = async (req: Request, res: Response): Promise<void> => 
  {
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
          const [result]: any = await connection.execute("DELETE FROM `tbl_post` WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      res.status(500).json({
        success: false,
        message: "record cant found"
      });
      return;
    }
    res.status(500).json({
      success: true,
      message: "Post successfull deleted"
    });
    } catch (error) {
      console.error("error cant delete", error);
      res.status(500).json({
        message: "server error", error: error.message
      })
    }
};
export const PostUpdate = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { post } = req.body;

    const connection = await connectDb();
    const [result]: any = await connection.execute(
      "UPDATE tbl_post SET post = ? WHERE id = ?",
      [post, id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({
        success: false,
        message: "Post not found"
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Post Successfully Updated"
    });
    
  } catch (error) {
    console.error("Can't Update Post", error);
    res.status(500).json({
      success: false,
      message: "Server error", 
      error: error.message
    });
  }
};