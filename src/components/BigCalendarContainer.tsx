import prisma from "@/lib/prisma";

import { adjustScheduleToCurrentWeek } from "@/lib/utils";
import BigCalendar from "./BigCalender";

const BigCalendarContainer = async ({
  type,
  id,
}: {
  type: "staffId" | "roomId";
  id: string | number;
}) => {
  // Fetch schedules based on type
  const dataRes = await prisma.careRoutine.findMany({
    where: {
      ...(type === "staffId"
        ? { staffId: id as string } // Assuming CareRoutine includes staffId
        : { roomId: id as number }),
    },
  });

  // Map fetched data into calendar events
  const data = dataRes.map((routine) => ({
    title: routine.name,
    start: routine.startTime,
    end: routine.endTime,
  }));

  // Adjust schedule to current week
  const schedule = adjustScheduleToCurrentWeek(data);

  return (
    <div className="bg-white p-4 rounded-md">
      <BigCalendar data={schedule} />
    </div>
  );
};

export default BigCalendarContainer;
