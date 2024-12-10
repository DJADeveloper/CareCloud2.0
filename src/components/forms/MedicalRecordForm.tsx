"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { Dispatch, SetStateAction, useEffect } from "react";
import { createMedicalRecord, updateMedicalRecord } from "@/lib/actions"; // Implement these server actions
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { z } from "zod";

const medicalRecordSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  residentId: z.string().min(1, "Resident is required"),
});

type MedicalRecordSchema = z.infer<typeof medicalRecordSchema>;

const MedicalRecordForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: { residents: { id: string; fullName: string }[] };
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MedicalRecordSchema>({
    resolver: zodResolver(medicalRecordSchema),
    defaultValues: {
      title: data?.title || "",
      description: data?.description || "",
      date: data?.date?.split("T")[0] || "", // assuming date is a DateTime field
      residentId: data?.residentId || "",
    },
  });

  // Replace `useFormState` with your own approach if you have a custom hook.
  // Otherwise, handle state (success/error) after calling the server actions manually.
  const [state, formAction] = useFormState(
    type === "create" ? createMedicalRecord : updateMedicalRecord,
    {
      success: false,
      error: false,
    }
  );

  const router = useRouter();

  const onSubmit = handleSubmit((formData) => {
    formAction({ ...formData, id: data?.id });
  });

  useEffect(() => {
    if (state.success) {
      toast(
        `Medical Record ${
          type === "create" ? "created" : "updated"
        } successfully!`
      );
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { residents } = relatedData || { residents: [] };

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create"
          ? "Create a New Medical Record"
          : "Update Medical Record"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Medical Record Details
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Title"
          name="title"
          register={register}
          error={errors.title}
        />
        <InputField
          label="Description"
          name="description"
          register={register}
          error={errors.description}
        />
        <InputField
          label="Date"
          name="date"
          register={register}
          error={errors.date}
          type="date"
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Resident</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("residentId")}
          >
            <option value="">Select a Resident</option>
            {residents.map((resident) => (
              <option key={resident.id} value={resident.id}>
                {resident.fullName}
              </option>
            ))}
          </select>
          {errors.residentId?.message && (
            <p className="text-xs text-red-400">
              {errors.residentId.message.toString()}
            </p>
          )}
        </div>
      </div>
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default MedicalRecordForm;
