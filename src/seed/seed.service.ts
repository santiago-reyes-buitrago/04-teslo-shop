import {Injectable} from '@nestjs/common';
import {ProductsService} from "../products/products.service";
import {DataSource} from "typeorm";
import {initialData} from "./data/initialData";
import {AuthService} from "../auth/auth.service";

@Injectable()
export class SeedService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly productService: ProductsService,
        private readonly userService: AuthService
    ) {
    }

    runSeed() {
        return this.populateDB();

    }

    private async deleteAllTablesDB() {
        return Promise.all([
            this.productService.deleteAllProducts(),
            this.userService.deleteAllUsers()

        ])
    }

    private async insertUsers() {
        const users = await Promise.all(initialData.users.map(user => this.userService.create(user)))
        return users[0];
    }

    private async populateDB() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await this.deleteAllTablesDB();
            const user = await this.insertUsers();
            await Promise.all(initialData.products.map(product => this.productService.create(product,user)))
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
