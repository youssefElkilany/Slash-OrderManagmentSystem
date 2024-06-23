import { Module } from '@nestjs/common';
import { prismaModule } from 'src/Prisma/prisma.module';
import { orderService } from './order.service';
import { JwtService } from '@nestjs/jwt';
import { orderController } from './order.controller';

@Module({
  imports: [prismaModule],
  controllers: [orderController],
  providers: [orderService,JwtService],
})
export class orderModule {}
