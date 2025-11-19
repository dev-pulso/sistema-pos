import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DetalleVenta } from "./entities/detalle-venta.entity";
import { Productos } from "src/productos/entities/producto.entity";
import { VentasController } from "./ventas.controller";
import { VentasService } from "./ventas.services";
import { Venta } from "./entities/venta.entity";
import { PrinterModule } from "src/printer/printer.module";

@Module({
  imports: [TypeOrmModule.forFeature([Venta, DetalleVenta, Productos]),
  PrinterModule],
  controllers: [VentasController],
  providers: [VentasService],
  exports: [VentasService],
})
export class VentasModule {}