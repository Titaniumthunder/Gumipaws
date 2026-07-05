-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "services",
ADD COLUMN     "addOns" TEXT[],
ADD COLUMN     "package" TEXT;

