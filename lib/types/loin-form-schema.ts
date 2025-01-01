import { z } from "zod";

export const LoginFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must me more than 2 characters" })
    .max(50, { message: "Username must be less than 50 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be more than 7 characters" })
    .max(16, { message: "Password must be less than 16 characters" }),
});
