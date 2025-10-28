import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Productos } from "./entities/producto.entity";
import { ProductsController } from "./productos.controller";
import { ProductsService } from "./productos.services";
import { Categorias } from "src/categorias/entities/categoria.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Productos,Categorias])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductosModule {}
