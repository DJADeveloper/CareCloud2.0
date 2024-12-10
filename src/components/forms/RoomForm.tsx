"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { Dispatch, SetStateAction, useEffect } from "react";
import { createRoom, updateRoom } from "@/lib/actions"; // Implement these server actions
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { z } from "zod";

// Define the validation schema for Room
const roomSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  capacity: z
    .string()
    .min(1, "Capacity is required")
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Capacity must be a positive number",
    }),
});

type RoomSchema = z.infer<typeof roomSchema>;

const RoomForm = ({
  type,
  data,
  setOpen,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoomSchema>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: data?.name || "",
      capacity: data?.capacity ? String(data.capacity) : "",
    },
  });

  // Similar pattern: use a custom hook or approach for form state
  // Here we assume a pattern like the previous forms:
  const [state, formAction] = useFormState(
    type === "create" ? createRoom : updateRoom,
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
      toast(`Room ${type === "create" ? "created" : "updated"} successfully!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a New Room" : "Update Room"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">Room Details</span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Name"
          name="name"
          register={register}
          error={errors.name}
        />
        <InputField
          label="Capacity"
          name="capacity"
          register={register}
          error={errors.capacity}
          type="number"
        />
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

export default RoomForm;
