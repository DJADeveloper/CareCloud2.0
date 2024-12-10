"use client";

import {
  deleteFamilyMember,
  deleteResident,
  deleteStaff,
  deleteRoom,
  deleteCarePlan,
  deleteMedicalRecord,
  deleteCareRoutine,
  deleteEvent,
  deleteAnnouncement,
} from "@/lib/actions";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FormContainerProps } from "./FormContainer";

const deleteActionMap = {
  family: deleteFamilyMember,
  resident: deleteResident,
  staff: deleteStaff,
  room: deleteRoom,
  carePlan: deleteCarePlan,
  medicalRecord: deleteMedicalRecord,
  careRoutine: deleteCareRoutine,
  event: deleteEvent,
  announcement: deleteAnnouncement,
};

// Lazy loading of form components
const StaffForm = dynamic(() => import("./forms/StaffForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ResidentForm = dynamic(() => import("./forms/ResidentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const FamilyForm = dynamic(() => import("./forms/FamilyForm"), {
  loading: () => <h1>Loading...</h1>,
});
const RoomForm = dynamic(() => import("./forms/RoomForm"), {
  loading: () => <h1>Loading...</h1>,
});
const CarePlanForm = dynamic(() => import("./forms/CarePlanForm"), {
  loading: () => <h1>Loading...</h1>,
});
const MedicalRecordForm = dynamic(() => import("./forms/MedicalRecordForm"), {
  loading: () => <h1>Loading...</h1>,
});
const CareRoutineForm = dynamic(() => import("./forms/CareRoutineForm"), {
  loading: () => <h1>Loading...</h1>,
});
const EventForm = dynamic(() => import("./forms/EventForm"), {
  loading: () => <h1>Loading...</h1>,
});
const AnnouncementForm = dynamic(() => import("./forms/AnnouncementForm"), {
  loading: () => <h1>Loading...</h1>,
});

// Map of forms to render
const forms: {
  [key: string]: (
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: "create" | "update",
    data?: any,
    relatedData?: any
  ) => JSX.Element;
} = {
  staff: (setOpen, type, data, relatedData) => (
    <StaffForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  resident: (setOpen, type, data, relatedData) => (
    <ResidentForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  family: (setOpen, type, data, relatedData) => (
    <FamilyForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  room: (setOpen, type, data, relatedData) => (
    <RoomForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  carePlan: (setOpen, type, data, relatedData) => (
    <CarePlanForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  medicalRecord: (setOpen, type, data, relatedData) => (
    <MedicalRecordForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  careRoutine: (setOpen, type, data, relatedData) => (
    <CareRoutineForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  event: (setOpen, type, data, relatedData) => (
    <EventForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  announcement: (setOpen, type, data, relatedData) => (
    <AnnouncementForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
};

const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData,
}: FormContainerProps & { relatedData?: any }) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
      ? "bg-lamaSky"
      : "bg-lamaPurple";

  const [open, setOpen] = useState(false);

  const Form = () => {
    const router = useRouter();

    useEffect(() => {
      if (!open) {
        router.refresh();
      }
    }, [open, router]);

    const formComponent = forms[table];

    // Handle cases where the table key is invalid
    if (!formComponent) {
      console.error(`Form not found for table: "${table}"`);
      return <div>Form not found!</div>;
    }

    return type === "delete" && id ? (
      <form
        action={deleteActionMap[table]}
        className="p-4 flex flex-col gap-4"
        method="POST"
      >
        <input type="hidden" name="id" value={id} />
        <span className="text-center font-medium">
          All data will be lost. Are you sure you want to delete this {table}?
        </span>
        <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
          Delete
        </button>
      </form>
    ) : type === "create" || type === "update" ? (
      formComponent(setOpen, type, data, relatedData)
    ) : (
      <div>Invalid form type!</div>
    );
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
