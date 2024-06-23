import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { CouponValidation } from './coupon.dto';

@Injectable()
export class couponService {
    constructor(private readonly prisma:PrismaService){}
 
  // only admin can add coupon
  // numOfUses refers to how many times each user can use this coupon
  async addCoupon(data:CouponValidation,user:any){
    const {code , amount , expireDate,numOfUses} = data

    
    const findCode = await this.prisma.PrismaClient.coupon.findUnique({where:{code}})
    if(findCode)
      {
        throw new ConflictException("code already exist")
      }
      if(Date.parse(expireDate) < Date.now())
        {
          throw new BadRequestException("enter a valid date")
        }
        const date = new Date(expireDate)
        console.log({date})

        const createCoupon = await this.prisma.PrismaClient.coupon.create({data:{code,amount,expireDate:date,numOfUses,createdBy:user.id}})
        if(!createCoupon)
          {
            throw new BadRequestException("no coupon have been created")
          }
          return {
            Msg:"coupon created successfuly",
            createCoupon
          }
  }
  
}
