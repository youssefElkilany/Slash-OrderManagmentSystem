import { ApiProperty } from "@nestjs/swagger"
import { Role } from "@prisma/client"
import { IsAlphanumeric, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator"


export class SignupDTO{

    @ApiProperty({
        example:"youssef elkilany"
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    name:string

    @ApiProperty({
        example:"elkilany19@gmail.com"
    })
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email:string

    @ApiProperty({
        description:"password must contain at least 1 uppercase and lowercase letter with 1 digit , any operator and min length is 8",
        example:"123456Aa@"
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password is too weak' })
    @MinLength(8)
    password:string
    
    @ApiProperty({
        description:"password must match above password",
        example:"123456Aa@"
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password is too weak' })
    @MinLength(8)
    cpassword:string

    @ApiProperty({
        example:"zayed city"
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    address:string

    @ApiProperty({
        example:"user",
        enum:["user","admin","seller"],
        description:"status must be one of the following values:user,admin,seller"
    })
    @IsString()
    @IsEnum(["user","admin","seller"],{message:"status must be one of the following values:user,admin,seller"})
    @IsOptional()
    role:Role


}


export class loginDTO{


    @ApiProperty({
        example:"elkilany19@gmail.com"
    })
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email:string

    @ApiProperty({
        example:"123456Aa@"
    })
    @IsString()
    @IsNotEmpty()
    password:string
    
}