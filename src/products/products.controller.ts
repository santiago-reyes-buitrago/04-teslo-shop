import {Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query} from '@nestjs/common';
import {ProductsService} from './products.service';
import {CreateProductDto} from './dto/create-product.dto';
import {UpdateProductDto} from './dto/update-product.dto';
import {PaginationDto} from "../common/dtos/pagination.dto";
import {Auth, GetUserDecorator} from "../auth/decorators";
import {ValidRole} from "../auth/enum/valid-role.enum";
import {User} from "../auth/entities/user.entity";
import {ApiResponse} from "@nestjs/swagger";
import {Product} from "./entities";

@Auth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {
  }

  @Post()
  // @Auth(ValidRole.ADMIN)
  @ApiResponse({status: 201, description: 'Product was created', type: Product})
  @ApiResponse({status: 400, description: 'Bad Request'})
  create(@Body() createProductDto: CreateProductDto, @GetUserDecorator() user: User) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto.limit, paginationDto.skip);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productsService.findOne(term);
  }

  @Patch(':id')
  @Auth(ValidRole.ADMIN)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto, @GetUserDecorator() user: User) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Auth(ValidRole.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
