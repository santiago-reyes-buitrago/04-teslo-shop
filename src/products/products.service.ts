import {BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException} from '@nestjs/common';
import {CreateProductDto} from './dto/create-product.dto';
import {UpdateProductDto} from './dto/update-product.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Product} from "./entities/product.entity";

@Injectable()
export class ProductsService {
    private logger = new Logger(ProductsService.name);

    constructor(
        @InjectRepository(Product) private readonly productRepository: Repository<Product>
    ) {
    }

    async create(createProductDto: CreateProductDto) {
        try {
            // if (!createProductDto.slug) createProductDto.slug = createProductDto.title.toLowerCase().replaceAll(' ', '_').replaceAll("'", '')
            const product = this.productRepository.create(createProductDto)
            return await this.productRepository.save(product);
        } catch (e) {
            this.handleExceptions(e)
        }
    }

    async findAll(limit: number = 10, skip: number = 0) {
        try {
            return await this.productRepository.find({
                skip,
                take: limit
            });
        } catch (e) {
            this.handleExceptions(e)
        }
    }

    async findOne(id: string) {
        try {
            return await this.productRepository.findOneBy({
                id
            })
        } catch (e) {
            this.handleExceptions(e)
        }
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        try {
            return await this.productRepository.update({
                id
            }, updateProductDto)
        } catch (e) {
            this.handleExceptions(e)
        }
    }

    async remove(id: string) {
        try {
            const product = await this.findOne(id)
            if (!product){
                throw new NotFoundException('No se encontro registro con el id: ', id)
            }

            return await this.productRepository.remove(product)
        } catch (e) {
            this.handleExceptions(e)
        }
    }

    private handleExceptions(error: any) {
        if (['23505'].includes(error.code)) {
            throw new BadRequestException(error.detail)
        }
        this.logger.error(error.detail || error.message);
        throw new InternalServerErrorException('Unexpected error, check server logs')
    }
}
