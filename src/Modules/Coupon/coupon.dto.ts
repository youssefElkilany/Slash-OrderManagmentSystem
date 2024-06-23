import { ApiProperty } from "@nestjs/swagger"
import { IsDate, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator"


export class CouponValidation {
    
    @ApiProperty({
        example:"50%Off",
        description:"unique code for coupon"
    })
    @IsString()
    @IsNotEmpty()
    code:string

    @ApiProperty({
        example:"10",
        description:"coupon calculated as percentage"
    })
    @IsInt()
    @IsNotEmpty()
    amount:number

    @ApiProperty({
        example:"7-22-2024",
        description:"date must be greater than today"
    })
    expireDate:string
    

    @ApiProperty({
        example:"3",
        description:"number of usage for each user ",
        default:1
    })
    @IsInt()
    @IsNotEmpty()
    @IsOptional() // default will be 1 
    numOfUses:number
}