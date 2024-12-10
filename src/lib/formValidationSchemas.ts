import { z } from "zod";

// Resident Schema
export const residentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  fullName: z.string().min(1, { message: "Full name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  dateOfBirth: z.coerce.date({ message: "Date of birth is required!" }),
  // sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  careLevel: z.enum(["LOW", "MEDIUM", "HIGH"], {
    message: "Care level is required!",
  }),
  familyId: z.string().min(1, { message: "Family ID is required!" }),
  roomId: z.coerce.number().optional(),
});

export type ResidentSchema = z.infer<typeof residentSchema>;

// Staff Schema
export const staffSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  role: z.enum(["ADMIN", "NURSE", "CAREGIVER"], {
    message: "Role is required!",
  }),
});

export type StaffSchema = z.infer<typeof staffSchema>;

// Family Member Schema
export const familySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  residents: z.array(z.string()).optional(), // Resident IDs
});

export type FamilySchema = z.infer<typeof familySchema>;

// Care Routine Schema
export const careRoutineSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Routine name is required!" }),
  day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], {
    message: "Day is required!",
  }),
  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime: z.coerce.date({ message: "End time is required!" }),
  roomId: z.coerce.number({ message: "Room ID is required!" }).optional(),
});

export type CareRoutineSchema = z.infer<typeof careRoutineSchema>;

// Care Plan Schema
export const carePlanSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title is required!" }),
  description: z.string().optional(),
  startDate: z.coerce.date({ message: "Start date is required!" }),
  endDate: z.coerce.date({ message: "End date is required!" }),
  residentId: z.string().min(1, { message: "Resident ID is required!" }),
});

export type CarePlanSchema = z.infer<typeof carePlanSchema>;

// Medical Record Schema
export const medicalRecordSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title is required!" }),
  description: z.string().optional(),
  date: z.coerce.date({ message: "Date is required!" }),
  residentId: z.string().min(1, { message: "Resident ID is required!" }),
});

export type MedicalRecordSchema = z.infer<typeof medicalRecordSchema>;

// Event & Announcement Schema
export const eventSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title is required!" }),
  description: z.string().optional(),
  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime: z.coerce.date({ message: "End time is required!" }),
  roomId: z.coerce.number({ message: "Room ID is required!" }).optional(),
});

export type EventSchema = z.infer<typeof eventSchema>;

export const announcementSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title is required!" }),
  description: z.string().optional(),
  date: z.coerce.date({ message: "Date is required!" }),
  roomId: z.coerce.number({ message: "Room ID is required!" }).optional(),
});

export type AnnouncementSchema = z.infer<typeof announcementSchema>;
