import {BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {validate as isUUID} from 'uuid';
import {CreateProductDto} from './dto/create-product.dto';
import {UpdateProductDto} from './dto/update-product.dto';
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

    async findOne(term: string) {
        try {
            if (isUUID(term)){
                return await this.productRepository.findOneBy({
                    id: term
                })
            }
            const queryBuilder =  this.productRepository.createQueryBuilder()
            return await queryBuilder.where(`title = LOWER(:title) or slug = LOWER(:slug)`,{
                title: term,slug: term
            }).getOne()
        } catch (e) {
            this.handleExceptions(e)
        }
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        // try {
        //
        // } catch (e) {
        //     this.handleExceptions(e)
        // }
        const product = await this.productRepository.preload({
            id,
            ...updateProductDto
        })
        if (!product) throw new NotFoundException(`Product with id ${id} not found`)
        return this.productRepository.save(product)
    }

    async remove(id: string) {
        try {
            const product = await this.findOne(id)
            if (!product) {
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
