import { Request, Response } from "express";
import prisma from "../db/prisma";

export const addSupplier = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { sup_name, sup_contact, sup_email } = req.body;
  try {
    await prisma.tbl_supplier.create({
      data: {
        sup_name,
        sup_contact,
        sup_email,
      },
    });
    res.status(500).json({ meessage: "supplier added" });
  } catch (error) {
    console.error("failed adding supplier:", error);
    res.status(500).json({ message: "internal error", error: error.message });
  }
};
