import {Injectable} from '@nestjs/common';
import {ProductsService} from "../products/products.service";
import {DataSource} from "typeorm";
import {initialData} from "./data/initialData";

@Injectable()
export class SeedService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly productService: ProductsService
    ) {
    }

    runSeed() {
        return this.populateDB();

    }

    private async deleteAllTablesDB() {
        await this.productService.deleteAllProducts()
    }

    private async populateDB() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await this.productService.deleteAllProducts()
            await Promise.all(initialData.products.map(product => this.productService.create(product)))
            // for (const product of initialData.products) {
            //     await this.productService.create(product)
            // }
            await queryRunner.commitTransaction();
            return `Seed executed successfully`
        } catch (err) {
            await queryRunner.rollbackTransaction();
            console.log(err)
        } finally {
            await queryRunner.release();
        }


    }
}
