/*
  Warnings:

  - You are about to drop the column `cartId` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_cartId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "cartId";

-- CreateTable
CREATE TABLE "cartProduct" (
    "id" SERIAL NOT NULL,
    "cartId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "cartProduct_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cartProduct" ADD CONSTRAINT "cartProduct_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cartProduct" ADD CONSTRAINT "cartProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
