import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { regestrationService } from './regestration.service';
import { AuthGuard } from 'src/guard/auth/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { SignupDTO, loginDTO } from './regestration.DTO';
import { ApiBadRequestResponse, ApiBody, ApiConflictResponse, ApiResponse } from '@nestjs/swagger';

@Controller()
export class regestrationController {
  constructor(private readonly rc: regestrationService) {}

  
  @Get("users")
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  findAll(@Req() req:any){
    return this.rc.findAll(req.user)
  }

  @Post("signup")
  @HttpCode(201)
  @ApiBadRequestResponse({description:"if user is not successfully created or password didnt match cpassword"})
  @ApiConflictResponse({description:"if email already exist"})
  @ApiResponse({status:201,description:"signup successfuly"})
  signup(@Body() body:SignupDTO){
    return this.rc.signup(body)
  }

  @Post("login")
  @HttpCode(201)
  // @ApiBody({})
  @ApiResponse({status:201,description:"login successfuly"})
  @ApiResponse({status:400,description:"check your email or password"})
  login(@Body() body:loginDTO){
    return this.rc.login(body)
  }


}
