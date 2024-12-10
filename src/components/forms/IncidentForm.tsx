"use client";

import { useState } from "react";
import { toast } from "react-toastify";

type IncidentFormProps = {
  residentId?: string; // Optional for preselecting a resident
  type: "create" | "update";
  data?: any; // Existing data for editing
  setOpen: (state: boolean) => void;
};

const IncidentForm = ({
  residentId,
  type,
  data,
  setOpen,
}: IncidentFormProps) => {
  const [formState, setFormState] = useState({
    residentId: data?.residentId || residentId || "",
    title: data?.title || "",
    description: data?.description || "",
    date: data?.date || new Date().toISOString().substring(0, 10), // Default to today
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (type === "create") {
        // Call backend API to create the incident
        await fetch("/api/incidents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formState),
        });
        toast.success("Incident logged successfully!");
      } else {
        // Call backend API to update the incident
        await fetch(`/api/incidents/${data.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formState),
        });
        toast.success("Incident updated successfully!");
      }
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      {/* Resident ID */}
      <label className="flex flex-col">
        <span className="font-medium">Resident</span>
        <input
          type="text"
          name="residentId"
          value={formState.residentId}
          onChange={handleInputChange}
          placeholder="Enter Resident ID"
          className="p-2 border rounded-md"
          required
        />
      </label>

      {/* Incident Title */}
      <label className="flex flex-col">
        <span className="font-medium">Title</span>
        <input
          type="text"
          name="title"
          value={formState.title}
          onChange={handleInputChange}
          placeholder="Enter Incident Title"
          className="p-2 border rounded-md"
          required
        />
      </label>

      {/* Incident Description */}
      <label className="flex flex-col">
        <span className="font-medium">Description</span>
        <textarea
          name="description"
          value={formState.description}
          onChange={handleInputChange}
          placeholder="Describe the incident"
          className="p-2 border rounded-md"
          rows={5}
          required
        />
      </label>

      {/* Date */}
      <label className="flex flex-col">
        <span className="font-medium">Date</span>
        <input
          type="date"
          name="date"
          value={formState.date}
          onChange={handleInputChange}
          className="p-2 border rounded-md"
          required
        />
      </label>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        {type === "create" ? "Log Incident" : "Update Incident"}
      </button>
    </form>
  );
};

export default IncidentForm;
