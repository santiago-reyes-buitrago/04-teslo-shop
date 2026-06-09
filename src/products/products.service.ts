import {BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {validate as isUUID} from 'uuid';
import {CreateProductDto} from './dto/create-product.dto';
import {UpdateProductDto} from './dto/update-product.dto';
import {DataSource, Repository} from "typeorm";
import {ProductImage,Product} from "./entities";
import {User} from "../auth/entities/user.entity";

@Injectable()
export class ProductsService {

    private readonly logger = new Logger(ProductsService.name);

    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(ProductImage)
        private readonly productImagesRepository: Repository<ProductImage>,
        private readonly dataSource: DataSource,
    ) {
    }

    async create(createProductDto: CreateProductDto,user: User) {

        try {

            const {images = [], ...productDetails} = createProductDto;

            const product = this.productRepository.create({

                ...productDetails,
                user,
                images: images.map(image =>
                    this.productImagesRepository.create({
                        url: image,
                    }),
                ),

            });

            await this.productRepository.save(product);

            return this.plainProduct(product);

        } catch (error) {

            this.handleExceptions(error);

        }

    }

    async findAll(limit = 10, skip = 0) {

        try {

            const products = await this.productRepository.find({

                take: Math.min(limit, 50),

                skip,

                relations: {
                    images: true,
                },

                order: {
                    title: 'ASC',
                },

            });

            return products.map(product => this.plainProduct(product));

        } catch (error) {

            this.handleExceptions(error);

        }

    }

    async findOne(term: string) {

        let product: Product | null = null;

        if (isUUID(term)) {

            product = await this.productRepository.findOne({

                where: {
                    id: term,
                },

                relations: {
                    images: true,
                },

            });

        } else {

            const queryBuilder =
                this.productRepository.createQueryBuilder('prod');

            product = await queryBuilder

                .leftJoinAndSelect('prod.images', 'prodImages')

                .where(
                    'LOWER(prod.title) = :title OR LOWER(prod.slug) = :slug',
                    {
                        title: term.toLowerCase(),
                        slug: term.toLowerCase(),
                    },
                )

                .getOne();

        }

        if (!product) {
            throw new NotFoundException(
                `Product with term "${term}" not found`,
            );
        }

        return this.plainProduct(product);

    }

    async update(id: string, updateProductDto: UpdateProductDto,user: User) {

        const {images, ...updateData} = updateProductDto;

        const product = await this.productRepository.preload({
            id,
            user,
            ...updateData,
        });

        if (!product) {
            throw new NotFoundException(
                `Product with id "${id}" not found`,
            );
        }

        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {

            if (images) {

                await queryRunner.manager.delete(ProductImage, {
                    product: {id},
                });

                product.images = images.map(image =>
                    this.productImagesRepository.create({
                        url: image,
                    }),
                );

            }

            await queryRunner.manager.save(product);

            await queryRunner.commitTransaction();

            return this.plainProduct(product);

        } catch (error) {

            await queryRunner.rollbackTransaction();

            this.handleExceptions(error);

        } finally {

            await queryRunner.release();

        }

    }

    async remove(id: string) {

        const product = await this.productRepository.findOne({
            where: {id},
        });

        if (!product) {
            throw new NotFoundException(
                `Product with id "${id}" not found`,
            );
        }

        await this.productRepository.remove(product);

        return {
            message: 'Product deleted successfully',
        };

    }

    async deleteAllProducts() {
        const queryRunner = this.productRepository.createQueryBuilder('product');
        try {
            return await queryRunner.delete().where({}).execute();
        }catch (err) {
            this.handleExceptions(err)
        }
    }

    private plainProduct(product: Product) {

        const {images = [], ...rest} = product;

        return {
            ...rest,
            images: images.map(image => image.url),
        };

    }

    private handleExceptions(error: any): never {

        if (error.code === '23505') {
            throw new BadRequestException(error.detail);
        }

        this.logger.error(
            error.detail || error.message,
            error.stack,
        );

        throw new InternalServerErrorException(
            'Unexpected error, check server logs',
        );

    }

}
