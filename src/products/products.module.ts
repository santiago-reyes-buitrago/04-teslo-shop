import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProductsService} from './products.service';
import {ProductsController} from './products.controller';
import {Product, ProductImages} from "./entities";

@Module({
    imports: [
        TypeOrmModule.forFeature([Product,ProductImages]),
    ],
    controllers: [ProductsController],
    providers: [ProductsService],
})
export class ProductsModule {
}