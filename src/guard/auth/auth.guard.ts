import { BadRequestException, CanActivate, ConflictException, ExecutionContext, Injectable, Next, NotFoundException, Req, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ApiBadRequestResponse } from '@nestjs/swagger';
import { Observable, startWith } from 'rxjs';
import { PrismaService } from 'src/Prisma/prisma.service';
import { Roles } from 'src/decorators/roles.decorator';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private readonly jwt:JwtService,private readonly prisma:PrismaService,private reflector: Reflector){}
 async canActivate(
    context: ExecutionContext,
  ):  Promise<boolean> {

    const request = context.switchToHttp().getRequest()
    const {authorization} = request.query
    
    console.log({authorization})
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
            const roles = this.reflector.getAllAndOverride<string[]>('roles', [
              context.getHandler(),
            ]);
            console.log({roles})
            if(!roles.includes(user.role))
              {
                throw new UnauthorizedException("Unauthorized account")
              }
            
            request.user = user
           Next()


    return true;
  }
}

// import {  NestMiddleware } from '@nestjs/common';
// import { Request, Response } from 'express';
// import * as jwt from 'jsonwebtoken'; // Example for JWT authentication

// @Injectable()
// export class AuthMiddleware implements NestMiddleware {
//   constructor(private readonly jwt:JwtService,private readonly prisma:PrismaService,private reflector: Reflector){}
// async  use(@Req() req:any,res: Response, next: Function) {
//   console.log({req})
//     const authorization = req.headers.authorization;
//     console.log({authorization1:authorization})

//     // Swagger documentation informs users about this header, but validation happens here
//     if(!authorization?.startsWith("Bearer"))
//       {
//         throw new BadRequestException("invalid bearer key")
//       }
//       const token = authorization.split("Bearer")[1]
//       if(!token)
//         {
//           throw new BadRequestException("invalid token")
//         }

//         const decodedToken = this.jwt.verify(token,{secret:process.env.JWTSECRET})
//         if(!decodedToken?.id)
//           {
//             throw new BadRequestException("invalid token payload")
//           }
//       const user = await this.prisma.PrismaClient.user.findUnique({where:{id:decodedToken.id},select:{id:true,email:true,role:true}})
//       if(!user)
//         {
//           throw new NotFoundException("user not found")
//         }
//       req.user = user; // Attach user data to request object
//       next()

//     } 
//     // catch (err) {
//     //  // return res.status(401).json({ message: 'Invalid token' });
//     // }

//    // next(); // Pass control to the controller
//   }

