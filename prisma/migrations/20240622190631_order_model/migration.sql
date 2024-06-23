-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('cash', 'visa');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('placed', 'waitingForPayment', 'cancelled', 'onTheWay', 'delivered');

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "orderedBy" INTEGER NOT NULL,
    "couponId" INTEGER,
    "confirmCoupon" BOOLEAN NOT NULL DEFAULT false,
    "paymentPrice" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "paymentMethod" "PaymentType" NOT NULL DEFAULT 'cash',
    "status" "Status" NOT NULL,
    "address" TEXT NOT NULL,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderProduct" (
    "id" SERIAL NOT NULL,
    "productName" TEXT NOT NULL,
    "productPrice" DECIMAL(65,30) NOT NULL,
    "paymentPrice" DECIMAL(65,30) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,

    CONSTRAINT "OrderProduct_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_orderedBy_fkey" FOREIGN KEY ("orderedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderProduct" ADD CONSTRAINT "OrderProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderProduct" ADD CONSTRAINT "OrderProduct_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
