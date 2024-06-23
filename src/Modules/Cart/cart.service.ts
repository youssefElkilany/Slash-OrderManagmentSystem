import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { CartValidation, RemoveCartDTO } from './cart.dto';

@Injectable()
export class cartService {
    constructor(private readonly prisma:PrismaService){}
 
  async addTorCart(data:CartValidation,user:any){

    const { productId , quantity } = data
    const getProduct = await this.prisma.PrismaClient.product.findUnique({where:{id:productId}})
    if(!getProduct)
      {
        throw new NotFoundException("product not found")
      }
      if(quantity > getProduct.stock)
        {
          throw new BadRequestException(`only ${getProduct.stock} in stock`)
        }
        console.log({stock:getProduct.stock})

    const getCart = await this.prisma.PrismaClient.cart.findUnique({
      where: {userId:user.id}
    })
    if(!getCart)
      {
        throw new NotFoundException("cart not found")
      }
    console.log({getCart})
    const getCarts = await this.prisma.PrismaClient.cartProduct.findMany({
      where: {cartId:getCart.id}
    })
    console.log({getCarts})

    let arr = []
    let flag = false
    // to check that product exist in cart
    for (const cart of getCarts) {
      if(cart.productId == productId)
        {
          flag = true
        //  arr = cart
          arr.push(cart)
        }
    }
    
    console.log({arr,flag}) 
    if(!flag)
      {
        const addProductToCart = await this.prisma.PrismaClient.cartProduct.create({data:{
          productId:productId,quantity,cartId:getCart.id
        }})
        if(!addProductToCart)
          {
            throw new BadRequestException("no product has been added to cart")
          }
        return {
          Msg:"product added to cart",
          addProductToCart
        }
      }
      else{
        if(arr[0].quantity + quantity > getProduct.stock)
          {
            throw new ConflictException(`only ${getProduct.stock} in stock`) 
          }
        const incremetProduct = await this.prisma.PrismaClient.cartProduct.update({where:{id:arr[0].id},
        data:{quantity:{increment:quantity}}})
        return {
          Msg:"quantity of product increased",
          incremetProduct
        }
      }

    }

  async getCartById(user:any){
    const cart =  await this.prisma.PrismaClient.cart.findUnique({where:{userId:user.id}})
    if(!cart)
      {
        throw new NotFoundException("cart not found")
      }
      const getProductsInCart = await this.prisma.PrismaClient.cartProduct.findMany({where:{cartId:cart.id},select:{productId:true,quantity:true}})
      if(!getProductsInCart)
        {
          throw new NotFoundException("cart not found")
        }
        return {
          Msg:"your cart",
          getProductsInCart
        }
  }

  // better to take cartId as param
  async updateCart(data:CartValidation,user:any){
    const {productId,quantity} = data
// to check that product exist in database
    const getProduct = await this.prisma.PrismaClient.product.findUnique({where:{id:productId}})
    if(!getProduct)
      {
        throw new NotFoundException("product not found in database")
      }
        console.log({userId:user.id})
      // to get cartId and check that cart already exist
    const cart = await this.prisma.PrismaClient.cart.findUnique({where:{userId:user.id}})
    if(!cart)
      {
        throw new NotFoundException("cart not found")
      }
      // to get products that user added to his cart
      const findProduct = await this.prisma.PrismaClient.cartProduct.findMany({where:{cartId:cart.id}})
      if(!findProduct.length)
        {
          throw new NotFoundException("no products found in your cart")
        }
        
        let arr = []
        let flag = false
        // to check that product is in his cart
        for (const cart of findProduct) {
          if(cart.productId == productId)
            {
              flag = true
              arr.push(cart)
            }
        }

        if(flag)
          {
            if( quantity > getProduct.stock)
              {
                throw new BadRequestException(`only ${getProduct.stock} in stock`) 
              }
            // to update quantity of product 
            const incremetProduct = await this.prisma.PrismaClient.cartProduct.update({where:{id:arr[0].id},
            data:{quantity:quantity}})
            return {
              Msg:"quantity of product modified",
              incremetProduct
            }
          }
          else{
            throw new NotFoundException("product not found in your cart")
          }

  }

  async removeProductFromCart(data:RemoveCartDTO,user:any){
    const {productId} = data
    // to check that product exist in database
        const getProduct = await this.prisma.PrismaClient.product.findUnique({where:{id:productId}})
        if(!getProduct)
          {
            throw new NotFoundException("product not found in database")
          }
          // to get cartId and check that cart already exist
        const cart = await this.prisma.PrismaClient.cart.findUnique({where:{userId:user.id}})
        if(!cart)
          {
            throw new NotFoundException("cart not found")
          }
          // to get products that user added to his cart
          const findProduct = await this.prisma.PrismaClient.cartProduct.findMany({where:{cartId:cart.id}})
          if(!findProduct.length)
            {
              throw new NotFoundException("no products found in your cart")
            }
            let arr = []
            let flag = false
            // to check that product is in his cart
            for (const cart of findProduct) {
              if(cart.productId == productId)
                {
                  flag = true
                  arr.push(cart)
                }
            }
    
            if(flag)
              {
                // to update quantity of product 
                const removeProduct = await this.prisma.PrismaClient.cartProduct.delete({where:{id:arr[0].id,productId}})
                if(!removeProduct)
                  {
                    throw new ConflictException("no product have been removed from cart")
                  }
                return {
                  Msg:"product removed successfully",
                  removeProduct

                }
              }
              else{
                throw new NotFoundException("product not found in your cart")
              }

  }



}
