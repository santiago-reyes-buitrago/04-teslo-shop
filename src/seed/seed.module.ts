import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import {ProductsModule} from "../products/products.module";
import {AuthModule} from "../auth/auth.module";

@Module({
  imports: [ProductsModule,AuthModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
