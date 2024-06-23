import { Module } from '@nestjs/common';
import { prismaModule } from 'src/Prisma/prisma.module';
import { productService } from './product.service';
import { productController } from './product.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [prismaModule],
  controllers: [productController],
  providers: [productService,JwtService],
})
export class productModule {}
