-- AlterTable
ALTER TABLE "CareRoutine" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'General';

-- CreateTable
CREATE TABLE "StaffTask" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "assigneeId" TEXT NOT NULL,
    "residentId" TEXT,

    CONSTRAINT "StaffTask_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StaffTask" ADD CONSTRAINT "StaffTask_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffTask" ADD CONSTRAINT "StaffTask_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE SET NULL ON UPDATE CASCADE;
