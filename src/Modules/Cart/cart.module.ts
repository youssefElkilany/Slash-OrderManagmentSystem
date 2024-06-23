import { Module } from '@nestjs/common';
import { prismaModule } from 'src/Prisma/prisma.module';
import { cartService } from './cart.service';
import { JwtService } from '@nestjs/jwt';
import { cartController } from './cart.controller';

@Module({
  imports: [prismaModule],
  controllers: [cartController],
  providers: [cartService,JwtService],
})
export class cartModule {}
