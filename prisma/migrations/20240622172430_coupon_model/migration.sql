-- CreateTable
CREATE TABLE "Coupon" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "numOfUses" INTEGER NOT NULL DEFAULT 1,
    "expireDate" TIMESTAMP(3) NOT NULL,
    "createdBy" INTEGER NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userCoupon" (
    "id" SERIAL NOT NULL,
    "couponId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "numOfUses" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "userCoupon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");

-- CreateIndex
CREATE UNIQUE INDEX "userCoupon_userId_key" ON "userCoupon"("userId");

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userCoupon" ADD CONSTRAINT "userCoupon_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userCoupon" ADD CONSTRAINT "userCoupon_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
