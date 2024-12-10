import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendar from "@/components/EventCalendar";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const ResidentPage = async () => {
  const { userId } = auth();

  // Fetch the resident's room and associated schedule
  const residentData = await prisma.resident.findUnique({
    where: { id: userId! },
    include: { room: true },
  });

  if (!residentData || !residentData.room) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-semibold text-red-500">
          Resident or Room data not found.
        </h1>
      </div>
    );
  }

  const { room } = residentData;

  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule ({room.name})</h1>
          <BigCalendarContainer type="roomId" id={room.id} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default ResidentPage;
