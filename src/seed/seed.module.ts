import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import {ProductsModule} from "../products/products.module";

@Module({
  imports: [ProductsModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
