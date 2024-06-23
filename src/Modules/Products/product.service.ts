import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { AddProductDto } from './product.dto';

@Injectable()
export class productService {
    constructor(private readonly prisma:PrismaService){}
 
  async addProduct(data:AddProductDto,user:any){
   const {name,description,price,discount} = data

   const findName = await this.prisma.PrismaClient.product.findUnique({where:{name}})
   if(findName)
    {
      throw new ConflictException("product already exist with the following name")
    }

    data.stock =  data.stock

    data.paymentPrice = data.price || 0 - (data.price || 0 * ((data.discount || 0) / 100))

    data.createdBy = user.id

    console.log({name,stock:data.stock,paymentPrice:data.paymentPrice,user:data.createdBy,discount,price})
    console.log({data})
    // const product = await this.prisma.PrismaClient.product.create({data:{
    //   name,description,discount,stock
    // }})
     const product = await this.prisma.PrismaClient.product.create({data})
     return {
      Msg:"product added successfully",
      product
     }
  }
  async getProducts(){
    return this.prisma.PrismaClient.product.findMany()
  }
}
