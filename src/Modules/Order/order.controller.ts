import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { orderService } from './order.service';
import { AuthGuard } from 'src/guard/auth/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ApplyCouponDTO, MakeAnOrderDTO, OrderByIdDTO, OrderByIdDTO2, UpdateStatusDTO } from './order.dto';
import { ApiBadRequestResponse, ApiConflictResponse, ApiNotFoundResponse, ApiQuery, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiQuery({name:"authorization",description:"jwt token for authentication , generated after login",example:"BearereyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzE5MTYzODUxfQ.0CXkAVp6vs4_5PISfZahhkjl9ogIXtKFk6ql3kjWs4Y"})
@ApiBadRequestResponse({description:"invalid bearerKey or invalid token"})
@ApiUnauthorizedResponse({description:"unAuthorized user"})
@Controller()
export class orderController {
  constructor(private readonly rc: orderService) {}

 

  @Post("orders")
  @Roles(['user'])
  @UseGuards(AuthGuard)
  @ApiNotFoundResponse({description:"if cart or products not found"})
  @ApiNotFoundResponse({description:"if users enters coupon and code not found"})
  @ApiBadRequestResponse({description:"coupon code already expired or already used it"})
  @ApiBadRequestResponse({description:"if quantity is greater than stock of product or oder creation failed"})
  @ApiResponse({status:201,description:"order created successfuly"})
  addorder(@Body() data:MakeAnOrderDTO,@Req() req:any,@Body() body:any){
    return this.rc.makeAnOrder(data,req.user)
  }


  @Get("orders/:orderId")
  @Roles(['user'])
  @UseGuards(AuthGuard)
  @ApiNotFoundResponse({description:"if order not found"})
  @ApiResponse({status:200,description:"get order successfuly"})
  getOrderById(@Req() req:any,@Param() p:OrderByIdDTO2) {
    return this.rc.getOrderById(req.user,p);
  }

  @Get("users/orders")
  @Roles(['user'])
  @UseGuards(AuthGuard)
  @ApiNotFoundResponse({description:"if no orders found"})
  @ApiResponse({status:200,description:"get orders history successfuly"})
  historyOfOrders(@Req() req:any) {
    return this.rc.historyOfOrders(req.user);
  }

  @Post("orders/apply-coupon")
  @Roles(['user'])
  @UseGuards(AuthGuard)
  @ApiNotFoundResponse({description:"if order or coupon code not found"})
  @ApiBadRequestResponse({description:"if he already used that coupon on order or exceeded limit of usage of that coupon"})
  @ApiResponse({status:200,description:"coupon applied to order successfuly"})
  applyCoupon(@Req() req:any,@Body() body:ApplyCouponDTO) {
    return this.rc.applyCoupon(req.user,body);
  }

  @Put("orders/:orderId/status")
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @ApiBadRequestResponse({description:"if status failed to be updated"})
  @ApiResponse({status:200,description:"status updated successfuly"})
  updateStatus(@Req() req:any,@Param() param:OrderByIdDTO2,@Body() data:UpdateStatusDTO){
    return this.rc.updateStatus(req.user,param,data)
  }
  
}
