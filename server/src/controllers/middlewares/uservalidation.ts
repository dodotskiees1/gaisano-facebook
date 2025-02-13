import { z } from "zod";

export const userSchema = z.object({
    name: z.string().min(1, "Name is required").regex(/^[A-Za-z\s]+$/, "Name must contain only letters and spaces"),
    middle: z.string().optional(),
    lastname: z.string().min(1, "Last name is required").regex(/^[A-Za-z\s]+$/, "Last name must contain only letters and spaces"),
    month: z.string().min(1, "Last name is required").regex(/^[A-Za-z\s]+$/, "Last name must contain only letters and spaces"),
    // day: z.number().int().min(1).max(31, "Invalid day"),
    // year: z.number().int().min(1, "year is required"),
    gender: z.string().min(1, "Gender is required"),
    address: z.string().min(1, "Address is required"),
    contact: z.string().min(10, "Invalid contact number"),
    email: z.string().email("Invalid email format"),
    // password: z.string().min(6, "Password must be at least 6 characters long"),
});
