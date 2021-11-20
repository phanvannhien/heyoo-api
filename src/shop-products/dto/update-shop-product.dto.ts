import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { CreateShopProductDto } from "./create-shop-product.dto";
import { PartialType } from '@nestjs/swagger';

export class UpdateShopProductDto extends PartialType(CreateShopProductDto) {}