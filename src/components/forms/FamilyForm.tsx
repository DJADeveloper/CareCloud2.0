"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { familySchema, FamilySchema } from "@/lib/familyValidationSchema"; // You'll create this schema
import InputField from "../InputField";
import { createFamily } from "@/lib/actions"; // A server action or an API call that creates a family
import { Dispatch, SetStateAction, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const FamilyForm = ({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FamilySchema>({
    resolver: zodResolver(familySchema),
  });

  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    const response = await createFamily(data);
    if (response.success) {
      toast("Family has been created!");
      setOpen(false);
      router.refresh(); // refresh to get new family data in resident form
    } else {
      toast("Something went wrong!");
    }
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Create a new Family</h1>
      <span className="text-xs text-gray-400 font-medium">
        Family Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Username"
          name="username"
          register={register}
          error={errors.username}
        />
        <InputField
          label="Name"
          name="name"
          register={register}
          error={errors.name}
        />
        <InputField
          label="Surname"
          name="surname"
          register={register}
          error={errors.surname}
        />
        <InputField
          label="Email"
          name="email"
          register={register}
          error={errors.email}
        />
        <InputField
          label="Phone"
          name="phone"
          register={register}
          error={errors.phone}
        />
        <InputField
          label="Address"
          name="address"
          register={register}
          error={errors.address}
        />
      </div>
      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        Create Family
      </button>
    </form>
  );
};

export default FamilyForm;
