import { Body, Controller, Delete, Get, HttpCode, Post, Put, Req, UseGuards } from '@nestjs/common';
import { cartService } from './cart.service';
import { AuthGuard } from 'src/guard/auth/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import {  CartValidation, RemoveCartDTO } from './cart.dto';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiQuery, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiQuery({name:"authorization",description:"jwt token for authentication , generated after login",example:"BearereyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzE5MTYzODUxfQ.0CXkAVp6vs4_5PISfZahhkjl9ogIXtKFk6ql3kjWs4Y"})
@ApiBadRequestResponse({description:"invalid bearerKey or invalid token"})
@ApiUnauthorizedResponse({description:"unAuthorized user"})
@Controller()
export class cartController {
  constructor(private readonly rc: cartService) {}

 
  @Post("cart/add")
  @Roles([,'user'])
  @UseGuards(AuthGuard)
  @HttpCode(201)
  @ApiNotFoundResponse({description:"if cart not found or product not found"})
  @ApiBadRequestResponse({description:"if quantity is greater than stock of product"})
  @ApiResponse({status:201,description:"when products are added to cart or increment quanity of product if already exist in cart"})
  addcart(@Body() data:CartValidation,@Req() req:any){
    return this.rc.addTorCart(data,req.user)
  }


  @Get("cart")
  @Roles(['user'])
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @ApiNotFoundResponse({description:"if cart not found"})
  @ApiResponse({status:200,description:"get cart successfuly"})
  getcarts(@Req() req:any){
    return this.rc.getCartById(req.user)
  }


  @Put("cart/update")
  @Roles(['user'])
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @ApiNotFoundResponse({description:"if cart not found or product not found in your cart"})
  @ApiBadRequestResponse({description:"if quantity is greater than stock of product"})
  @ApiResponse({status:200,description:"update cart successfuly"})
  UpdateCart(@Body() data:CartValidation,@Req() req:any){
    return this.rc.updateCart(data,req.user)
  }

  @Delete("cart/remove")
  @Roles(['user'])
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @ApiNotFoundResponse({description:"if product not found in your cart"})
  @ApiResponse({status:200,description:"remove product from cart successfuly"})
  removeProductFromCart(@Body() data:RemoveCartDTO,@Req() req:any){
    return this.rc.removeProductFromCart(data,req.user)
  }
}
