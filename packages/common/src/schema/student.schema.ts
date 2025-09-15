// studentSchemas.ts
import { z } from "zod";

// FileType schema
export const fileSchema = z.object({
  profile_pic: z.instanceof(File).nullable(), // can be null
  banner_pic: z.instanceof(File).nullable(),  // can be null
});

// Student data schema
export const studentDataSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  phoneNo: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  interests: z
    .array(z.string())
    .min(1, "Select at least one interest"),
});

//Combined
export const studentProfileSchema = z.object({
  files: fileSchema,
  data: studentDataSchema,
});

