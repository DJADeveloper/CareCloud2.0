import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const FamilyPage = async () => {
  const { userId } = auth();
  const currentUserId = userId;

  // Fetch residents associated with the family member
  const residents = await prisma.resident.findMany({
    where: {
      familyId: currentUserId!,
    },
  });

  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3 flex flex-col gap-4">
        {residents.map((resident) => (
          <div className="h-full bg-white p-4 rounded-md" key={resident.id}>
            <h1 className="text-xl font-semibold">
              Schedule ({resident.fullName})
            </h1>
            <BigCalendarContainer type="roomId" id={resident.roomId!} />
          </div>
        ))}
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcements />
      </div>
    </div>
  );
};

export default FamilyPage;
