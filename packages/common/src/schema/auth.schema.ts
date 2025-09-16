// zodSchemas.ts
import { z } from "zod";

// Signup schema
export const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z
    .string()
    .email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
  type: z.enum(["STUDENT", "TEACHER"], "Invalid user type"), // you can expand this if you have more types
});

// Login schema
export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
  type: z.enum(["STUDENT", "TEACHER"], "Invalid user type"),
});

// Example usage
// const parsedSignup = signupSchema.parse(data);
// const parsedLogin = loginSchema.parse(data);
