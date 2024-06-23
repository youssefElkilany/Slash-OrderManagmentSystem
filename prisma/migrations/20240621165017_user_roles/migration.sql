-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin', 'seller');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'user',
ALTER COLUMN "address" DROP NOT NULL;
