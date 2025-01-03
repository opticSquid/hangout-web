import { z } from "zod";

export const SignupFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must me more than 2 characters" })
    .max(50, { message: "Username must be less than 50 characters" }),
  email: z
    .string()
    .min(3, { message: "Email must be more than 5 letters long" })
    .max(50, { message: "Email must be less than 50 characters long" }),
  password: z
    .string()
    .min(8, { message: "Password must be more than 7 characters" })
    .max(16, { message: "Password must be less than 16 characters" }),
});
