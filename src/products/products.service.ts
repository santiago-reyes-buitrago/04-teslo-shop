import {Injectable, InternalServerErrorException, Logger} from '@nestjs/common';
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
            const product = this.productRepository.create(createProductDto)
            return await this.productRepository.save(product);
        } catch (e) {
            this.logger.error(e.detail || e.message);
            throw new InternalServerErrorException('Ayuda');
        }
    }

    findAll() {
        return `This action returns all products`;
    }

    findOne(id: number) {
        return `This action returns a #${id} product`;
    }

    update(id: number, updateProductDto: UpdateProductDto) {
        return `This action updates a #${id} product`;
    }

    remove(id: number) {
        return `This action removes a #${id} product`;
    }
}
