import { Body, Controller, Get, Headers, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { productService } from './product.service';
import { AuthGuard } from 'src/guard/auth/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { AddProductDto } from './product.dto';
import { ApiBadRequestResponse, ApiConflictResponse, ApiHeader, ApiHeaders, ApiParam, ApiQuery, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthMiddleware } from 'src/guard/auth/auth.guard2';


@Controller()
export class productController {
  constructor(private readonly rc: productService) {}

  
  @Post("products/add")
  @Roles(['seller','admin'])
  @UseGuards(AuthGuard)
 // @ApiQuery({name:"authorization",description:"jwt token for authentication",example:"BearereyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzE4OTg0ODAyfQ.BiBexkSk82fpKJsOvnPhZla0GXifVLizHPln8DwWZ1Q"})
  @HttpCode(201)
  @ApiQuery({name:"authorization",description:"jwt token for authentication , generated after login",example:"BearereyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzE4OTg0ODAyfQ.BiBexkSk82fpKJsOvnPhZla0GXifVLizHPln8DwWZ1Q"})
  @ApiBadRequestResponse({description:"invalid bearerKey or invalid token"})
  @ApiUnauthorizedResponse({description:"unAuthorized user"})
  @ApiConflictResponse({description:"if product name already exist"})
  @ApiResponse({status:201,description:"product created successfuly"})
  addProduct(@Body() data:AddProductDto,@Req() req:any){
    return this.rc.addProduct(data,req.user)
  }

  @Get("products")
  @HttpCode(200)
  @ApiResponse({status:200,description:"get all products"})
  getProducts(){
    return this.rc.getProducts()
  }
}
