/*
  Warnings:

  - Changed the type of `day` on the `CareRoutine` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Day" ADD VALUE 'SATURDAY';
ALTER TYPE "Day" ADD VALUE 'SUNDAY';

-- AlterTable
ALTER TABLE "CareRoutine" DROP COLUMN "day",
ADD COLUMN     "day" "Day" NOT NULL;
