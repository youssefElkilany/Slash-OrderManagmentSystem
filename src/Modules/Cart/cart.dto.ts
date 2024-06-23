import { ApiProperty } from "@nestjs/swagger"
import { IsInt, IsNotEmpty } from "class-validator"


export class CartValidation {

    @ApiProperty({
        example:"1",
        description:"id of product"
    })
    @IsInt()
    @IsNotEmpty()
    productId:number

    @ApiProperty({
        example:"5",
        description:"quantity of product needed to buy and increment everytime when user add to cart if same product"
    })
    @IsInt()
    @IsNotEmpty()
    quantity:number
}

export class RemoveCartDTO {

    @ApiProperty({
        example:"1",
        description:"id of product"
    })
    @IsInt()
    @IsNotEmpty()
    productId:number
}