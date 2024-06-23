import { Module } from '@nestjs/common';
import { regestrationController } from './regestration.controller';
import { regestrationService } from './regestration.service';
import { prismaModule } from 'src/Prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [prismaModule],
  controllers: [regestrationController],
  providers: [regestrationService,JwtService],
})
export class regestrationModule {}
