import { Body, Controller, Delete, Get, HttpCode, Post, Put, Req, UseGuards } from '@nestjs/common';
import { couponService } from './coupon.service';
import { AuthGuard } from 'src/guard/auth/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { CouponValidation } from './coupon.dto';
import { ApiBadRequestResponse, ApiConflictResponse, ApiQuery, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiQuery({name:"authorization",description:"jwt token for authentication , generated after login",example:"BearereyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzE4OTg0ODAyfQ.BiBexkSk82fpKJsOvnPhZla0GXifVLizHPln8DwWZ1Q"})
@ApiBadRequestResponse({description:"invalid bearerKey or invalid token"})
@ApiUnauthorizedResponse({description:"unAuthorized user"})
@Controller()
export class couponController {
  constructor(private readonly rc: couponService) {}

  
  @Post("coupon")
  @Roles(['seller','admin'])
  @UseGuards(AuthGuard)
  @HttpCode(201)
  // @ApiQuery({name:"authorization",description:"jwt token for authentication , generated after login",example:"BearereyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzE4OTg0ODAyfQ.BiBexkSk82fpKJsOvnPhZla0GXifVLizHPln8DwWZ1Q"})
  // @ApiBadRequestResponse({description:"invalid bearerKey or invalid token"})
  // @ApiUnauthorizedResponse({description:"unAuthorized user"})
  @ApiConflictResponse({description:"if coupon code already exist"})
  @ApiBadRequestResponse({description:"if users enters an invalid date or coupon not created"})
  @ApiResponse({status:201,description:"coupon created successfuly"})
  addcoupon(@Body() data:CouponValidation,@Req() req:any){
    return this.rc.addCoupon(data,req.user)
  }
  
}
