import {  BadRequestException, Injectable, NestMiddleware, NotFoundException, Query, Req } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken'; // Example for JWT authentication
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwt:JwtService,private readonly prisma:PrismaService,private reflector: Reflector){}
async  use(@Req() req:any,@Query() query:any, next: Function) {
 // console.log({req})
    const authorization = req.headers.authorization;
    //console.log({query})
    console.log({auth:query.auth})
    //const auth = req.query
    console.log({authorization1:authorization})

   // console.log("GGGGGG")
    // Swagger documentation informs users about this header, but validation happens here
    if(!authorization?.startsWith("Bearer"))
      {
        throw new BadRequestException("invalid bearer key")
      }
      const token = authorization.split("Bearer")[1]
      if(!token)
        {
          throw new BadRequestException("invalid token")
        }

        const decodedToken = this.jwt.verify(token,{secret:process.env.JWTSECRET})
        if(!decodedToken?.id)
          {
            throw new BadRequestException("invalid token payload")
          }
      const user = await this.prisma.PrismaClient.user.findUnique({where:{id:decodedToken.id},select:{id:true,email:true,role:true}})
      if(!user)
        {
          throw new NotFoundException("user not found")
        }
      req.user = user; // Attach user data to request object
      console.log({user:req.user})
      next()

    } 
    // catch (err) {
    //  // return res.status(401).json({ message: 'Invalid token' });
    // }

   // next(); // Pass control to the controller
  }