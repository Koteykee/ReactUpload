import { z } from "zod";

export const editSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name can't be empty")
    .max(30, "Name is too long")
    .nonempty("This field is required"),
  isPublic: z.enum(["true", "false"]).refine((val) => val !== undefined, {
    message: "This field is required",
  }),
});

export type EditSchemaType = z.infer<typeof editSchema>;
