import { ApiProperty } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, isEnum } from "class-validator";

export class MakeAnOrderDTO {

    @ApiProperty({
        example:"zayed city"
    })
    @IsString()
    @IsNotEmpty()
    address:string

    @ApiProperty({
        example:"50%Off",
        description:"code of coupon"
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    couponCode:string

    userCoupon

    coupon

    paymentPrice

    paymentMethod

}

export class OrderByIdDTO {

    @ApiProperty({
        example:1,
        description:"id of the order"
    })
    @IsInt()
    @IsNotEmpty()
    orderId:number
}

export class OrderByIdDTO2 {

    @ApiProperty({
        example:1,
        description:"id of the order in param"
    })
    @IsString()
    @IsNotEmpty()
    orderId:string
}


export class ApplyCouponDTO {

    @ApiProperty({
        example:1,
        description:"id of the order"
    })
    @IsInt()
    @IsNotEmpty()
    orderId:number

    @ApiProperty({
        example:"50%Off",
        description:"code of coupon"
    })
    @IsString()
    @IsNotEmpty()
    couponCode:string
}

export class UpdateStatusDTO {

    @ApiProperty({
        example:1,
        description:"status must be one of the following values: 'waitingForPayment','onTheWay','cancelled','delivered','placed'",
        enum:['waitingForPayment','onTheWay','cancelled','delivered','placed']
    })
    @IsString()
    @IsNotEmpty()
    @IsEnum(['waitingForPayment','onTheWay','cancelled','delivered','placed'],{message:"status must be one of the following values: 'waitingForPayment','onTheWay','cancelled','delivered','placed'"})
    status:Status

    
}