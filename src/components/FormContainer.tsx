import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { auth } from "@clerk/nextjs/server";
import { StaffRole } from "@prisma/client";

export type FormContainerProps = {
  table:
    | "staff"
    | "resident"
    | "family"
    | "room"
    | "carePlan"
    | "medicalRecord"
    | "careRoutine"
    | "event"
    | "announcement"
    | "assessment";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};

  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  if (type !== "delete") {
    switch (table) {
      case "staff":
        const staffRoles = Object.keys(StaffRole); // This gives you the keys of the enum
        relatedData = { roles: staffRoles };
        break;

      case "resident":
        const residentRooms = await prisma.room.findMany({
          select: { id: true, name: true },
        });
        const residentFamilies = await prisma.familyMember.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { rooms: residentRooms, families: residentFamilies };
        break;

      case "family":
        const associatedResidents = await prisma.resident.findMany({
          select: { id: true, fullName: true },
        });
        relatedData = { residents: associatedResidents };
        break;

      case "room":
        const routinesForRooms = await prisma.careRoutine.findMany({
          select: { id: true, name: true },
        });
        relatedData = { routines: routinesForRooms };
        break;

      case "carePlan":
      case "medicalRecord":
        const associatedResidentsForPlans = await prisma.resident.findMany({
          select: { id: true, fullName: true },
        });
        relatedData = { residents: associatedResidentsForPlans };
        break;

      case "careRoutine":
        const roomOptions = await prisma.room.findMany({
          select: { id: true, name: true },
        });
        relatedData = { rooms: roomOptions };
        break;

      case "event":
      case "announcement":
        const availableRooms = await prisma.room.findMany({
          select: { id: true, name: true },
        });
        relatedData = { rooms: availableRooms };
        break;

      case "assessment":
        const residentsForAssessment = await prisma.resident.findMany({
          select: { id: true, fullName: true },
        });
        const careProviders = await prisma.staff.findMany({
          where: { role: "CARE_PROVIDER" },
          select: { id: true, name: true, surname: true },
        });
        const relatedPlans = await prisma.carePlan.findMany({
          select: { id: true, title: true },
        });
        relatedData = {
          residents: residentsForAssessment,
          careProviders,
          carePlans: relatedPlans,
        };
        break;

      default:
        break;
    }
  }

  return (
    <div className="">
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
