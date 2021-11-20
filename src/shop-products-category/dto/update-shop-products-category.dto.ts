import { PartialType } from '@nestjs/mapped-types';
import { CreateShopProductCategoryDto } from './create-shop-products-category.dto';

export class UpdateShopProductCategoryDto extends PartialType(CreateShopProductCategoryDto) {}
