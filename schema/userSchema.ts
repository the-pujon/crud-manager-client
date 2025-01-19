import { z } from "zod";
import { zfd } from "zod-form-data";

// Define Zod schema
export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "user"]),
  address: z.string().min(1, "Address is required"),
  active: z.boolean().optional(),
  languages: z.array(z.string()).optional(), 
  phone: z.string().optional(),
  birthdate: z.date().optional(),
  gender: z.enum(["male", "female", "other"]),
  image: zfd.file().optional(),
});


// Define Zod schema
export const UpdateUserSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  role: z.enum(["admin", "user"]).optional(), 
  address: z.string().min(1, "Address is required").optional(),
  active: z.boolean().optional().optional(), 
  languages: z.array(z.string()).optional(), 
  phone: z.string().optional().optional(),
  birthdate: z.date().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  image: zfd.file().optional(),
});

