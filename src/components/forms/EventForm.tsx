"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { Dispatch, SetStateAction, useEffect } from "react";
import { createEvent, updateEvent } from "@/lib/actions"; // Ensure these actions exist
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { z } from "zod";

const eventSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  roomId: z.string().nullable(),
});

type EventSchema = z.infer<typeof eventSchema>;

const EventForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: { rooms: { id: number; name: string }[] };
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventSchema>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: data?.title || "",
      description: data?.description || "",
      startTime: data?.startTime?.split("T")[0] || "",
      endTime: data?.endTime?.split("T")[0] || "",
      roomId: data?.roomId ? String(data.roomId) : "",
    },
  });

  const [state, formAction] = useFormState(
    type === "create" ? createEvent : updateEvent,
    { success: false, error: false }
  );

  const router = useRouter();

  const onSubmit = handleSubmit((formData) => {
    // Convert roomId to number or null
    const roomId = formData.roomId ? Number(formData.roomId) : null;
    formAction({ ...formData, id: data?.id, roomId });
  });

  useEffect(() => {
    if (state.success) {
      toast(`Event ${type === "create" ? "created" : "updated"} successfully!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { rooms } = relatedData || { rooms: [] };

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a New Event" : "Update Event"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">Event Details</span>
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
          label="Start Time"
          name="startTime"
          register={register}
          error={errors.startTime}
          type="date"
        />
        <InputField
          label="End Time"
          name="endTime"
          register={register}
          error={errors.endTime}
          type="date"
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Room (Optional)</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("roomId")}
          >
            <option value="">No Room</option>
            {rooms.map((room) => (
              <option key={room.id} value={String(room.id)}>
                {room.name}
              </option>
            ))}
          </select>
          {errors.roomId?.message && (
            <p className="text-xs text-red-400">
              {errors.roomId.message.toString()}
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

export default EventForm;
