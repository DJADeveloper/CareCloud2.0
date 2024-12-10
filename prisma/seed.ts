import { PrismaClient, CareLevel, StaffRole, Day } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // ADMIN (New Admin Model)
  const existingAdminEntity = await prisma.admin.findUnique({
    where: { id: "adminEntity1" },
  });
  if (!existingAdminEntity) {
    await prisma.admin.create({
      data: {
        id: "adminEntity1",
        username: "adminEntity1",
        name: "Admin",
        surname: "EntityUser",
        email: "adminEntity@example.com",
        phone: "123-456-9999",
        // If you have tasks or other relations for Admin, add them here
      },
    });
  }

  // ROOMS
  for (let i = 1; i <= 6; i++) {
    const existingRoom = await prisma.room.findUnique({ where: { id: i } });
    if (!existingRoom) {
      await prisma.room.create({
        data: {
          name: `Room ${i}`,
          capacity: Math.floor(Math.random() * 5) + 1,
        },
      });
    }
  }

  // FAMILY MEMBERS
  for (let i = 1; i <= 25; i++) {
    const familyId = `family${i}`;
    const existingFamily = await prisma.familyMember.findUnique({
      where: { id: familyId },
    });
    if (!existingFamily) {
      await prisma.familyMember.create({
        data: {
          id: familyId,
          username: `family${i}`,
          name: `Family Name ${i}`,
          surname: `Family Surname ${i}`,
          email: `family${i}@example.com`,
          phone: `456-789-${i.toString().padStart(4, "0")}`,
          address: `Address ${i}`,
        },
      });
    }
  }

  // RESIDENTS
  for (let i = 1; i <= 50; i++) {
    const residentId = `resident${i}`;
    const existingResident = await prisma.resident.findUnique({
      where: { id: residentId },
    });
    if (!existingResident) {
      const familyId = `family${Math.ceil(i / 2)}`;
      await prisma.resident.create({
        data: {
          id: residentId,
          fullName: `Resident ${i}`,
          email: `resident${i}@example.com`,
          phone: `555-123-${i.toString().padStart(4, "0")}`,
          address: `Address ${i}`,
          dateOfBirth: new Date(
            new Date().setFullYear(new Date().getFullYear() - (60 + (i % 20)))
          ),
          careLevel: i % 3 === 0 ? "LOW" : i % 3 === 1 ? "MEDIUM" : "HIGH",
          emergencyContactName: `Emergency Contact ${i}`,
          emergencyContactPhone: `999-999-${i.toString().padStart(4, "0")}`,
          familyId,
          roomId: (i % 6) + 1,
        },
      });
    }
  }

  // EVENTS
  for (let i = 1; i <= 5; i++) {
    const existingEvent = await prisma.event.findFirst({
      where: { title: `Event ${i}` },
    });
    if (!existingEvent) {
      await prisma.event.create({
        data: {
          title: `Event ${i}`,
          description: `Description for Event ${i}`,
          startTime: new Date(),
          endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
          roomId: i % 6 === 0 ? null : (i % 6) + 1,
        },
      });
    }
  }

  // ANNOUNCEMENTS
  for (let i = 1; i <= 5; i++) {
    const existingAnnouncement = await prisma.announcement.findFirst({
      where: { title: `Announcement ${i}` },
    });
    if (!existingAnnouncement) {
      await prisma.announcement.create({
        data: {
          title: `Announcement ${i}`,
          description: `Description for Announcement ${i}`,
          date: new Date(),
          roomId: i % 6 === 0 ? null : (i % 6) + 1,
        },
      });
    }
  }

  // CARE ROUTINES
  const categories = [
    "Personal Care",
    "Medication Management",
    "Physical Therapy",
    "Meal Time",
    "Housekeeping",
    "Social Activities",
    "Doctor Visits",
    "Mental Stimulation",
    "Emergency Response",
    "Spiritual Care",
  ];

  const days = Object.values(Day);

  for (let i = 1; i <= 30; i++) {
    const existingRoutine = await prisma.careRoutine.findFirst({
      where: { name: `Care Routine ${i}` },
    });
    if (!existingRoutine) {
      await prisma.careRoutine.create({
        data: {
          name: `Care Routine ${i}`,
          day: days[i % days.length],
          startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
          endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
          roomId: (i % 6) + 1,
          category: categories[i % categories.length],
        },
      });
    }
  }

  console.log("Seeding completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
