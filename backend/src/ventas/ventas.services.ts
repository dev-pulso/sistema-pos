import { Between, Repository } from "typeorm";
import { Ventas } from "./entities/ventas.entity";
import { Injectable } from "@nestjs/common";
import { CrearVentaDto } from "./dto/ventas.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { VentaItem } from "./entities/items-ventas.entity";
import { Productos } from "src/productos/entities/producto.entity";
import { ProductsService } from "src/productos/productos.services";

@Injectable()
export class VentasService {
    constructor(
        @InjectRepository(Ventas)
        private readonly ventasRepository: Repository<Ventas>,
        @InjectRepository(VentaItem)
        private readonly ventasItemRepository: Repository<VentaItem>,
        @InjectRepository(Productos)
        private readonly productosRepository: ProductsService
    ) { }

    async crearVenta(venta: CrearVentaDto) {
        const nuevaVenta = this.ventasRepository.create({
            subtotal: venta.subtotal,
            tax: venta.tax,
            descuento: venta.descuento || 0,
            total: venta.total,
            user: { id: venta.userId },
            cliente: venta.clienteId ? { id: venta.clienteId } : undefined,
        })

        const ventaGuardada = await this.ventasRepository.save(nuevaVenta);

        for (const item of venta.items) {
            const ventaItems = this.ventasItemRepository.create({
                cantidad: item.cantidad,
                precio: item.precio,
                subtotal: item.cantidad * item.precio,
                venta: ventaGuardada,
                productos: { id: item.productoId },
            })

            await this.ventasItemRepository.save(ventaItems);
            await this.productosRepository.actualizarStock(item.productoId, item.cantidad);
        }
    }

    async reporteVentas(fechaInicial: Date, fechaFinal: Date) {
        const ventas = await this.ventasRepository.find({
            where: {
                createdAt: Between(fechaInicial, fechaFinal),
            },
            relations: ['cliente', 'user', 'items', 'items.productos'],
        })
        return ventas
    }
}