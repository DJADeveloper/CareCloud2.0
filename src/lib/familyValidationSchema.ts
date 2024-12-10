import { z } from "zod";

export const familySchema = z.object({
  username: z.string().min(1, "Username is required"),
  name: z.string().min(1, "Name is required"),
  surname: z.string().min(1, "Surname is required"),
  email: z.string().email("Invalid email format").optional(),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
});

export type FamilySchema = z.infer<typeof familySchema>;
