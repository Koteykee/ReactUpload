import { z } from "zod";

export const registrationSchema = z
  .object({
    email: z.email().trim().nonempty("Username is required"),
    password: z
      .string()
      .trim()
      .min(4, "Password must be at least 4 characters")
      .max(30, "Password must be at most 30 characters")
      .nonempty("Password is required"),
    confirmPassword: z.string().trim().nonempty("Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegistrationSchemaType = z.infer<typeof registrationSchema>;
