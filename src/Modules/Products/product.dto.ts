import { ApiProperty } from "@nestjs/swagger"
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"


export class AddProductDto {

    @ApiProperty({
        description:"product name",
        example:"V7"
    })
    @IsString()
    @IsNotEmpty()
    name:string

    @ApiProperty({
        description:"number of products available in stock",
        example:"100",
        default:1
    })
    @IsInt()
    @IsNotEmpty()
    @IsOptional()// so stock will be only 1
    stock:number

    // @IsNumber()
    // @IsNotEmpty()
    paymentPrice:number

    @ApiProperty({
        description:"price of product",
        example:"100"
    })
    @IsNumber()
    @IsNotEmpty()
    price:number

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    description:string

    @ApiProperty({
        description:"discount for product",
        example:"10",
        default:0
    })
    @IsNotEmpty()
    @IsOptional()
    @IsNumber()
    discount:number

    createdBy:number




}