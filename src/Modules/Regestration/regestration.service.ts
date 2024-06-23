import { BadRequestException, ConflictException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { SignupDTO, loginDTO } from './regestration.DTO';
@Injectable()
export class regestrationService {
    constructor(private readonly prisma:PrismaService,private readonly jwt:JwtService){}
 
  async findAll(users:object){
   // console.log({users})
    const user = await this.prisma.PrismaClient.user.findMany()
   // console.log({user})
    return user
  }

  async signup(body:SignupDTO){
    const {name,email,password,cpassword,address,role} = body

    const findEmail = await this.prisma.PrismaClient.user.findUnique({
      where:{email}
    })
    if(findEmail)
      {
        throw new ConflictException("email already exist")
      }
      if(password!=cpassword)
        {
          throw new BadRequestException("password dont match") 
        }
      let hashedPass = bcrypt.hashSync(password,parseInt(process.env.SALTROUND))

      const user = await this.prisma.PrismaClient.user.create({data:{
        email,name,password:hashedPass,address,role
      }})
      if(!user)
        {
          throw new BadRequestException("user failed to be created")
        }
        console.log({role})
        console.log({role:user.role})
        if(user.role == "user")
          {

            const cart = await this.prisma.PrismaClient.cart.create({data:{userId:user.id}})
            if(!cart)
              {
                throw new BadRequestException("cart didnt created")
              }
          }

     
      return {
        Msg:"sign up successfuly",
        user
      }
  }

  async login(body:loginDTO){
    const {email,password} = body
    const findEmail = await this.prisma.PrismaClient.user.findUnique({
      where:{email}
    })
    if(!findEmail || !bcrypt.compareSync(password,findEmail.password))
      {
        throw new BadRequestException("check your email or password") 
      }
      
let token = this.jwt.sign({id:findEmail.id},{secret:process.env.JWTSECRET})

      return {
        Msg:"login successfully",
        token
      }
    
  }
}
