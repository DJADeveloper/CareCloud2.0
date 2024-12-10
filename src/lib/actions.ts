"use server";

import { revalidatePath } from "next/cache";
import prisma from "./prisma";
import { clerkClient } from "@clerk/nextjs/server";

// Types for current state
type CurrentState = { success: boolean; error: boolean };

// Create a resident
export const createResident = async (
  currentState: CurrentState,
  data: {
    fullName: string;
    dateOfBirth: Date;
    careLevel: string;
    roomId: number | null;
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactEmail: string;
  }
) => {
  try {
    await prisma.resident.create({
      data: {
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth,
        careLevel: data.careLevel,
        roomId: data.roomId,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        emergencyContactEmail: data.emergencyContactEmail || null,
      },
    });

    revalidatePath("/list/residents");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

// Update a resident
export const updateResident = async (
  currentState: CurrentState,
  data: {
    id: string;
    fullName: string;
    dateOfBirth: Date;
    careLevel: string;
    roomId: number | null;
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactEmail: string;
  }
) => {
  try {
    await prisma.resident.update({
      where: {
        id: data.id,
      },
      data: {
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth,
        careLevel: data.careLevel,
        roomId: data.roomId,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        emergencyContactEmail: data.emergencyContactEmail || null,
      },
    });

    revalidatePath("/list/residents");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

// Delete a resident
export const deleteResident = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.resident.delete({
      where: {
        id,
      },
    });

    revalidatePath("/list/residents");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

// Create a family member
export const createFamilyMember = async (
  currentState: CurrentState,
  data: {
    username: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    address: string;
    residentId: string;
  }
) => {
  try {
    const user = await clerkClient.users.createUser({
      username: data.username,
      firstName: data.name,
      lastName: data.surname,
      email: data.email,
      publicMetadata: { role: "family" },
    });

    await prisma.familyMember.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        residents: {
          connect: { id: data.residentId },
        },
      },
    });

    revalidatePath("/list/family-members");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

// Additional examples for staff, rooms, events, and announcements

export const createEvent = async (
  currentState: CurrentState,
  data: {
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    roomId: number | null;
  }
) => {
  try {
    await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        roomId: data.roomId,
      },
    });

    revalidatePath("/list/events");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

export const createRoom = async (
  currentState: { success: boolean; error: boolean },
  data: { name: string; capacity: number }
) => {
  try {
    await prisma.room.create({
      data: {
        name: data.name,
        capacity: data.capacity,
      },
    });

    revalidatePath("/list/rooms");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

export const updateRoom = async (
  currentState: { success: boolean; error: boolean },
  data: { id: number; name: string; capacity: number }
) => {
  try {
    await prisma.room.update({
      where: { id: data.id },
      data: {
        name: data.name,
        capacity: data.capacity,
      },
    });

    revalidatePath("/list/rooms");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

export const createCarePlan = async (
  currentState: { success: boolean; error: boolean },
  data: {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    residentId: string;
  }
) => {
  try {
    await prisma.carePlan.create({
      data: {
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        resident: {
          connect: { id: data.residentId },
        },
      },
    });

    revalidatePath("/list/care-plans");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

export const updateCarePlan = async (
  currentState: { success: boolean; error: boolean },
  data: {
    id: number;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    residentId: string;
  }
) => {
  try {
    await prisma.carePlan.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        resident: {
          connect: { id: data.residentId },
        },
      },
    });

    revalidatePath("/list/care-plans");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

export const createAdmin = async (
  currentState: { success: boolean; error: boolean },
  data: {
    username: string;
    name: string;
    surname: string;
    email?: string;
    phone?: string;
  }
) => {
  try {
    await prisma.admin.create({
      data: {
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
      },
    });

    revalidatePath("/list/admins");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

export const updateAdmin = async (
  currentState: { success: boolean; error: boolean },
  data: {
    id: string;
    username: string;
    name: string;
    surname: string;
    email?: string;
    phone?: string;
  }
) => {
  try {
    await prisma.admin.update({
      where: { id: data.id },
      data: {
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
      },
    });

    revalidatePath("/list/admins");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

export const createMedicalRecord = async (
  currentState: { success: boolean; error: boolean },
  data: {
    title: string;
    description: string;
    date: Date;
    residentId: string;
  }
) => {
  try {
    await prisma.medicalRecord.create({
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        resident: {
          connect: { id: data.residentId },
        },
      },
    });

    revalidatePath("/list/medical-records");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

export const updateMedicalRecord = async (
  currentState: { success: boolean; error: boolean },
  data: {
    id: number;
    title: string;
    description: string;
    date: Date;
    residentId: string;
  }
) => {
  try {
    await prisma.medicalRecord.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        resident: {
          connect: { id: data.residentId },
        },
      },
    });

    revalidatePath("/list/medical-records");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

export const updateEvent = async (
  currentState: { success: boolean; error: boolean },
  data: {
    id: number;
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    roomId: number | null;
  }
) => {
  try {
    await prisma.event.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        roomId: data.roomId,
      },
    });
    revalidatePath("/list/events");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

export const createAnnouncement = async (
  currentState: { success: boolean; error: boolean },
  data: {
    title: string;
    description: string;
    date: Date;
    roomId: number | null;
  }
) => {
  try {
    await prisma.announcement.create({ data });
    revalidatePath("/list/announcements");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

export const updateAnnouncement = async (
  currentState: { success: boolean; error: boolean },
  data: {
    id: number;
    title: string;
    description: string;
    date: Date;
    roomId: number | null;
  }
) => {
  try {
    await prisma.announcement.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        roomId: data.roomId,
      },
    });
    revalidatePath("/list/announcements");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

// Create a care routine
export const createCareRoutine = async (
  currentState: { success: boolean; error: boolean },
  data: {
    name: string;
    day: string; // Should match one of the Day enum values (e.g. "MONDAY")
    startTime: Date;
    endTime: Date;
    roomId?: number | null;
    category?: string;
  }
) => {
  try {
    await prisma.careRoutine.create({
      data: {
        name: data.name,
        day: data.day as any, // cast to enum if needed, or ensure day is of the correct enum type
        startTime: data.startTime,
        endTime: data.endTime,
        roomId: data.roomId ?? null,
        category: data.category ?? "General",
      },
    });

    revalidatePath("/list/care-routines");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

// Update a care routine
export const updateCareRoutine = async (
  currentState: { success: boolean; error: boolean },
  data: {
    id: number;
    name: string;
    day: string;
    startTime: Date;
    endTime: Date;
    roomId?: number | null;
    category?: string;
  }
) => {
  try {
    await prisma.careRoutine.update({
      where: { id: data.id },
      data: {
        name: data.name,
        day: data.day as any,
        startTime: data.startTime,
        endTime: data.endTime,
        roomId: data.roomId ?? null,
        category: data.category ?? "General",
      },
    });

    revalidatePath("/list/care-routines");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};
// Create Family action with Clerk integration
export const createFamily = async (data: {
  username: string;
  name: string;
  surname: string;
  email?: string;
  phone: string;
  address: string;
}) => {
  try {
    // Create a user in Clerk
    const user = await clerkClient.users.createUser({
      username: data.username,
      firstName: data.name,
      lastName: data.surname,
      emailAddress: data.email, // Clerk expects emailAddress instead of email
      publicMetadata: { role: "family" },
    });

    // Use the Clerk user ID to identify the family member in Prisma
    await prisma.familyMember.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone,
        address: data.address,
      },
    });

    revalidatePath("/list/family-members");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};
