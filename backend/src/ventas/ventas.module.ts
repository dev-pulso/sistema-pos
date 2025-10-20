import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VentaItem } from "./entities/items-ventas.entity";
import { Ventas } from "./entities/ventas.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Ventas, VentaItem])],
  controllers: [],
  providers: [],
  exports: [],
})
export class VentasModule {}