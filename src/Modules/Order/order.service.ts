import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { ApplyCouponDTO, MakeAnOrderDTO, OrderByIdDTO, OrderByIdDTO2, UpdateStatusDTO } from './order.dto';
import { Status } from '@prisma/client';

@Injectable()
export class orderService {
    constructor(private readonly prisma:PrismaService){}
 


  async getOrderById(user:any,param:OrderByIdDTO2){
    const {orderId} = param

    let order = []
    const findOrder = await this.prisma.PrismaClient.order.findUnique({where:{id:Number(orderId),orderedBy:user.id},
  select:{
    paymentPrice:true,status:true,address:true,paymentMethod:true,createdAt:true,updatedAt:true
  }})
    if(!findOrder)
      {
        throw new NotFoundException("order not found")
      }
      order.push(findOrder)
      console.log({findOrder,order})
      const findProducts = await this.prisma.PrismaClient.orderProduct.findMany({where:{orderId:Number(orderId)},
      select:{productName:true,paymentPrice:true,productPrice:true,quantity:true}})
      if(!findProducts?.length)
        {
          throw new NotFoundException("no products in order are found")
        }
        order.push(...findProducts)
        console.log({order})

        return {
          Msg:"your orders",
          order
        }

  }
 // ngeeb products mn cart
  async makeAnOrder(data:MakeAnOrderDTO,user:any){

    const {couponCode} = data
    const getCart = await this.prisma.PrismaClient.cart.findUnique({where:{userId:user.id}})
    if(!getCart)
      {
        throw new NotFoundException("no cart found")
      }

      const getProducts = await this.prisma.PrismaClient.cartProduct.findMany({where:{cartId:getCart.id}})
      if(!getProducts?.length)
        {
          throw new NotFoundException("no products found in your cart")
        }
        console.log({getProducts})
        // check if user enetered coupon
        if(couponCode)
          {
            // to check that coupon exist or not
            const checkCoupon = await this.prisma.PrismaClient.coupon.findUnique({where:{code:couponCode}})
            if(!checkCoupon)
              {
                throw new NotFoundException("coupon code not found")
              }
              const date = new Date(checkCoupon.expireDate)
              // to check expire date of coupon
              if(date <= new Date())
                {
                  throw new BadRequestException("coupon is already expired")
                }
                // to check that user used that coupon before and how many times did he use it
                const checkUsageOfCoupon = await this.prisma.PrismaClient.userCoupon.findFirst({where:{couponId:checkCoupon.id,userId:user.id}})
                if(checkUsageOfCoupon?.numOfUses >= checkCoupon.numOfUses)
                  {
                    throw new BadRequestException("u already used that coupon before")
                  }
                  data.userCoupon = checkUsageOfCoupon
                  data.coupon = checkCoupon
                  console.log({coupon:data.coupon})
                  console.log({userCoupon:data.userCoupon})
          }

          console.log({getProducts})
          let totalPrice:number = 0
          for (const product of getProducts) {
            const findProduct = await this.prisma.PrismaClient.product.findUnique({where:{id:product.productId}})
            if(!findProduct)
              {
                throw new NotFoundException("product not found")
              }
              if(product.quantity > findProduct.stock)
                {
                  throw new BadRequestException(`only  ${findProduct.stock} in stock in ${findProduct.name}`)
                }
                
                  totalPrice += Number(findProduct.paymentPrice) * product.quantity
                  console.log({paymentPrice:findProduct.paymentPrice,quantity:product.quantity})
                  console.log({totalPrice})
          }
          data.paymentPrice = totalPrice
// // to apply coupon to paymentPrice user enter a coupon
 data.paymentPrice = (totalPrice - (totalPrice * (data?.coupon?.amount || 0)/100))

// mmkn a3ml get lel user w ageeb address bta3o aw user y7ot address gdeed
const order = await this.prisma.PrismaClient.order.create({data:{couponId:data?.coupon?.id,
  confirmCoupon:data?.coupon?.id != null || undefined ? true : false,
  orderedBy:user.id,
  paymentPrice:data.paymentPrice,
  paymentMethod:data.paymentMethod,
  status:data?.paymentMethod == 'card' ? 'waitingForPayment' : 'placed',
  address:data?.address
}})
if(!order)
  {
    throw new BadRequestException("order creation failed")
  }
console.log({order})

// to add products to orderProduct Model => to get all products
for (const product of getProducts) {
  const findProduct = await this.prisma.PrismaClient.product.findUnique({where:{id:product.productId}})
            if(!findProduct)
              {
                throw new NotFoundException("product not found")
              }

              const addProductsToOrder = await this.prisma.PrismaClient.orderProduct.create({data:{
                productName:findProduct.name,
                productPrice:findProduct.price,
                paymentPrice:findProduct.paymentPrice,
                quantity:product.quantity,
                productId:findProduct.id,
                orderId:order.id
              }})
              if(!addProductsToOrder)
                {
                  throw new ConflictException("no product added to order")
                }

                // decrement stock of product
                const updateProduct = await this.prisma.PrismaClient.product.update({where:{id:findProduct.id},data:{
                  stock:Number(findProduct.stock)-Number(product.quantity)
                }})
                if(!updateProduct)
                  {
                    throw new ConflictException("nothing is updated in product")
                  }

}
// to make cart empty 
const deleteCart = await this.prisma.PrismaClient.cartProduct.deleteMany({where:{cartId:getCart.id}})
if(!deleteCart)
  {
    return new ConflictException("no products found in cart")
  }

  if(data?.coupon)
    {
      console.log("gg1")
      if(!data?.userCoupon)
        {
          console.log("gg2")
           // if he didnt used that coupon before
            const createUserCoupon = await this.prisma.PrismaClient.userCoupon.create({data:{
              userId:user.id,couponId:data.coupon.id
            }})
        }
        else{// if he uses that coupon before
          const findUserCoupon = await this.prisma.PrismaClient.userCoupon.findFirst({where:{userId:user.id,couponId:data.coupon.id}})
        if(findUserCoupon)
          {
            console.log("gg3")
            // if he uses this coupon many times
            const updateUserCoupon = await this.prisma.PrismaClient.userCoupon.updateMany({where:{userId:user.id,couponId:data.coupon.id},
              data:{
                numOfUses:{increment:1}
              }})
          } // if he didnt used that coupon before
         
        }
    }

return {
  Msg:"order completed successefully",
  order
}


  }

  async historyOfOrders(user:any){
    
    console.log({user})
    const findOrders = await this.prisma.PrismaClient.order.findMany({where:{orderedBy:user.id}})
    if(!findOrders?.length)
      {
        throw new NotFoundException("you have no orders yet")
      }
      console.log({findOrders})
      let arr = []
      let ordersArr = []
     // arr.push(findOrders)
      for (const orders of findOrders) {
        console.log({orders})
       // arr.push(orders)
        const getOrders = await this.prisma.PrismaClient.orderProduct.findMany({where:{orderId:orders.id},
          select:{productName:true,paymentPrice:true,productPrice:true,quantity:true}})
        if(!getOrders)
          {
            throw new NotFoundException("no products found in orders")
          }
          console.log({getOrders})
          arr.push(orders,...getOrders)
          ordersArr.push(arr)
          console.log({arr})

      }
      return {
        OrdersHistory:ordersArr
      }
  }


  async applyCoupon(user:any,data:ApplyCouponDTO){

    const {couponCode,orderId} = data
    // to find order
    const findOrder = await this.prisma.PrismaClient.order.findUnique({where:{id:orderId,orderedBy:user.id}})
    if(!findOrder)
      {
        throw new NotFoundException("order not found")
      }
     // to check if he already used coupon on that order
      if(findOrder.confirmCoupon == true)
        {
          throw new ConflictException("you already used coupon in this order before")
        }
      // to find coupon 
      const findCoupon = await this.prisma.PrismaClient.coupon.findUnique({where:{code:couponCode}})
      if(!findCoupon)
        {
          throw new NotFoundException("couponCode not found")
        }
        
        if(findCoupon.expireDate < new Date())
          {
            throw new BadRequestException("coupon already expired")
          }
        // to find if user used that coupon before
        const findUserCoupon = await this.prisma.PrismaClient.userCoupon.findFirst({where:{userId:Number(user.id),couponId:findCoupon.id}})
        if(findUserCoupon)
          {
            // if he uses this coupon many times
          
            if(findCoupon.numOfUses <= findUserCoupon.numOfUses)
              {
                throw new BadRequestException("u exceeded limit of using that coupon")
              }// increment numOfusesby => 1
            const updateUserCoupon = await this.prisma.PrismaClient.userCoupon.updateMany({where:{userId:Number(user.id),couponId:findCoupon.id},
              data:{
                numOfUses:{increment:1}
              }})
          } // if he didnt used that coupon before
          else{
            const createUserCoupon = await this.prisma.PrismaClient.userCoupon.create({data:{
              userId:user.id,couponId:findCoupon.id
            }})
          }

        // apply coupon to order and update order
      
        let discount = (Number(findOrder.paymentPrice) - (Number(findOrder.paymentPrice) * (findCoupon.amount)/100))

      const addCoupon = await this.prisma.PrismaClient.order.update({where:{id:orderId},
      data:{
        couponId:findCoupon.id,confirmCoupon:true,paymentPrice:discount
      }})
      if(!addCoupon)
        {
          throw new ConflictException("no coupon added to order")
        }
        
        
      return {
        addCoupon
      }
  }


  async updateStatus(user:any,params:OrderByIdDTO2,data:UpdateStatusDTO){

  const {orderId} = params
  const {status} = data

  const findOrder = await this.prisma.PrismaClient.order.update({where:{id:Number(orderId)},data:{status}})
  if(!findOrder)
    {
      throw new BadRequestException("order havent been updated")
    }
    return {
      Order:findOrder
    }
  }
  
}
