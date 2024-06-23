import { Module } from '@nestjs/common';
import { prismaModule } from 'src/Prisma/prisma.module';
import { couponService } from './coupon.service';
import { JwtService } from '@nestjs/jwt';
import { couponController } from './coupon.controller';

@Module({
  imports: [prismaModule],
  controllers: [couponController],
  providers: [couponService,JwtService],
})
export class couponModule {}
