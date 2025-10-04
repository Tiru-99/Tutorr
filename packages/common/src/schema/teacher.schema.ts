
import { z } from "zod";

// File/Image schema
export const teacherFilesSchema = z.object({
    profile_pic: z.instanceof(File).nullable(),
    banner_pic: z.instanceof(File).nullable(),
    license: z.instanceof(File).nullable(),
});

// Teacher data schema
export const teacherDataSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be less than 50 characters"),
    email: z
        .string()
        .email("Invalid email address"),
    phone_number: z
        .string()
        .regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
    company_name: z
        .string()
        .min(2, "Company name must be at least 2 characters")
        .max(100, "Company name must be less than 100 characters"),
    highest_education: z
        .string()
        .min(2, "Education info too short"),
    years_of_exp: z
        .string()
        .regex(/^[0-9]+$/, "Years of experience must be a number")
        .refine(val => Number(val) <= 99, {
            message: "Experience cannot exceed 99 years",
        }),
    about: z
        .string()
        .min(10, "About section must be at least 10 characters")
        .max(200, "About section must be less than 200 characters"),
    expertise: z.array(z.string()).min(2, "Select at least 2 expertise fields"),
    price: z
        .number()
        .min(1, "Price cannot be negative")
        .max(500, "Price cannot be more than 500$")

});

// Combined 
export const teacherProfileSchema = z.object({
    files: teacherFilesSchema,
    data: teacherDataSchema,
});
