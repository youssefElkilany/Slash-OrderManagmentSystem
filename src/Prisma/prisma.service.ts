import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";


@Injectable()
export class PrismaService{
    public PrismaClient :PrismaClient
    constructor(){
        this.PrismaClient = new PrismaClient()
    }
}