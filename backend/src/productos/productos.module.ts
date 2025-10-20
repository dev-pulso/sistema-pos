import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Productos } from "./entities/producto.entity";
import { ProductsController } from "./productos.controller";
import { ProductsService } from "./productos.services";

@Module({
  imports: [TypeOrmModule.forFeature([Productos])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductosModule {}
