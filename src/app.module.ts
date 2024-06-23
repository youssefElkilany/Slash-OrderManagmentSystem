import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { regestrationModule } from './Modules/Regestration/regestration.module';
import { productModule } from './Modules/Products/product.module';
import { ConfigModule } from '@nestjs/config';
import { prismaModule } from './Prisma/prisma.module';
import { cartModule } from './Modules/Cart/cart.module';
import { couponModule } from './Modules/Coupon/coupon.module';
import { orderModule } from './Modules/Order/order.module';
import { AuthMiddleware } from './guard/auth/auth.guard2';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [regestrationModule,productModule,prismaModule,cartModule,couponModule,orderModule,ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService,JwtService],
})
export class AppModule {} 
// implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       // .apply(AuthMiddleware)
//       // .forRoutes({ path: '*', method: RequestMethod.ALL });
//   }
// }
