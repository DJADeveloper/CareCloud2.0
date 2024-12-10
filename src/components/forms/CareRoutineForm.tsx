"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
  careRoutineSchema,
  CareRoutineSchema,
} from "@/lib/formValidationSchemas";
import { createCareRoutine, updateCareRoutine } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const CareRoutineForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CareRoutineSchema>({
    resolver: zodResolver(careRoutineSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createCareRoutine : updateCareRoutine,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    formAction(data);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(
        `Care routine has been ${type === "create" ? "created" : "updated"}!`
      );
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { rooms, days } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create"
          ? "Create a new care routine"
          : "Update the care routine"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Routine Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        <InputField
          label="Start Time"
          name="startTime"
          defaultValue={data?.startTime}
          register={register}
          error={errors?.startTime}
          type="time"
        />
        <InputField
          label="End Time"
          name="endTime"
          defaultValue={data?.endTime}
          register={register}
          error={errors?.endTime}
          type="time"
        />
        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Day</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("day")}
            defaultValue={data?.day}
          >
            {days.map((day: string) => (
              <option value={day} key={day}>
                {day}
              </option>
            ))}
          </select>
          {errors.day?.message && (
            <p className="text-xs text-red-400">
              {errors.day.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Room</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("roomId")}
            defaultValue={data?.roomId}
          >
            {rooms.map((room: { id: number; name: string }) => (
              <option
                value={room.id}
                key={room.id}
                selected={data && room.id === data.roomId}
              >
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
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default CareRoutineForm;
