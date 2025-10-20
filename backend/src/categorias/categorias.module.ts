import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Categorias } from "./entities/categoria.entity";
import { CategoriasService } from "./categorias.services";
import { CategoriasController } from "./categorias.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Categorias])],
  controllers: [CategoriasController],
  providers: [CategoriasService],
  exports: [],
})
export class CategoriasModule {}