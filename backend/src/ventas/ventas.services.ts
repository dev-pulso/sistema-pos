import { Between, Repository } from "typeorm";
import { Venta } from "./entities/venta.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateVentaDto } from "./dto/create-venta.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { DetalleVenta } from "./entities/detalle-venta.entity";
import { Productos } from "src/productos/entities/producto.entity";
import { DataSource } from "typeorm";
import { Users } from "src/users/entities/users.entity";

@Injectable()
export class VentasService {
    constructor(
        @InjectRepository(Venta)
        private ventaRepository: Repository<Venta>,
        @InjectRepository(DetalleVenta)
        private detalleVentaRepository: Repository<DetalleVenta>,
        @InjectRepository(Productos)
        private productoRepository: Repository<Productos>,
        private dataSource: DataSource
    ) { }

    async crearVenta(createVentaDto: CreateVentaDto, usuarioId: string) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Crear la venta
            const venta = this.ventaRepository.create({
                total: createVentaDto.total,
                usuarioId,
                cashRecibido: createVentaDto.cashRecibido,
            });

            await queryRunner.manager.save(venta);

            // Procesar cada detalle de la venta
            for (const detalle of createVentaDto.detalles) {
                // Verificar producto y stock
                const producto = await this.productoRepository.findOneBy({ id: detalle.productoId });
                if (!producto) {
                    throw new NotFoundException(`Producto con ID ${detalle.productoId} no encontrado`);
                }

                const cantidad = Number(detalle.cantidad ?? 0);
                const gramos = Number(detalle.gramos ?? 0);

                if ((cantidad <= 0) && (gramos <= 0)) {
                    throw new Error(`Debe especificar una cantidad o gramos para el producto ${producto.nombre}`);
                }

                // Validar stock según el tipo de venta
                if (gramos > 0) {
                    if (producto.stock < gramos) {
                        throw new Error(`Stock insuficiente para el producto ${producto.nombre}`);
                    }
                } else {
                    if (producto.stock < cantidad) {
                        throw new Error(`Stock insuficiente para el producto ${producto.nombre}`);
                    }
                }

                // Crear detalle de venta
                const detalleVenta = this.detalleVentaRepository.create({
                    ventaId: venta.id,
                    productoId: detalle.productoId,
                    ...(cantidad > 0 ? { cantidad } : {}),
                    ...(gramos > 0 ? { gramos } : {}),
                    precioUnitario: detalle.precioUnitario,
                    subtotal: detalle.subtotal,
                });

                await queryRunner.manager.save(detalleVenta);

                // Actualizar stock del producto
                producto.stock -= gramos > 0 ? gramos : cantidad;
                await queryRunner.manager.save(producto);
            }

            await queryRunner.commitTransaction();

            // Retornar la venta con sus detalles
            return this.ventaRepository.findOne({
                where: { id: venta.id },
                relations: ['detalles', 'detalles.producto', 'usuario'],
            });

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async reporteVentas(fechaInicial: Date, fechaFinal: Date) {

        try {
            const ventas = await this.ventaRepository.find({
                where: {
                    createdAt: Between(fechaInicial, fechaFinal),
                },
                relations: ['usuario', 'detalles', 'detalles.producto'],
                order: {
                    createdAt: 'DESC',
                },
            });
            const resumen = {
                totalVentas: ventas.length,
                montoTotal: ventas.reduce((sum, venta) => sum + Number(venta.total), 0),
                productosVendidos: await this.obtenerProductosVendidos(ventas),
                ventas: ventas.map(venta => ({
                    id: venta.id,
                    fecha: venta.createdAt,
                    total: venta.total,
                    vendidoPor: venta.usuario.nombres,
                    detalles: venta.detalles.map(detalle => ({
                        producto: detalle.producto.nombre,
                        cantidad: detalle.cantidad,
                        precioUnitario: detalle.precioUnitario,
                        subtotal: detalle.subtotal,
                    })),
                })),
            };

            return resumen;

        } catch (error) {
            console.log('Error al generar el reporte de ventas:', error.message);
            throw new Error(error.message || 'Error al generar el reporte de ventas');

        }

    }

    private async obtenerProductosVendidos(ventas: Venta[]) {
        const productosMap = new Map();

        ventas.forEach(venta => {
            venta.detalles.forEach(detalle => {
                const producto = detalle.producto;
                if (!productosMap.has(producto.id)) {
                    productosMap.set(producto.id, {
                        id: producto.id,
                        nombre: producto.nombre,
                        cantidadTotal: 0,
                        montoTotal: 0,
                    });
                }

                const stats = productosMap.get(producto.id);
                stats.cantidadTotal += detalle.cantidad;
                stats.montoTotal += Number(detalle.subtotal);
            });
        });

        return Array.from(productosMap.values())
            .sort((a, b) => b.montoTotal - a.montoTotal);
    }

    async reporteXdia() {
        try {

            const now = new Date()

            const inicioDia = new Date(now.setHours(0, 0, 0, 0));
            const finDia = new Date(now.setHours(23, 59, 59, 999));
            const ventas = await this.ventaRepository.find({
                where: {
                    createdAt: Between(inicioDia, finDia),
                },
                relations: ['usuario', 'detalles', 'detalles.producto'],
                order: {
                    createdAt: 'DESC',
                }
            })


            const resumen = {
                totalVentas: ventas.length,
                montoTotal: ventas.reduce((sum, venta) => sum + Number(venta.total), 0),
                productosVendidos: await this.obtenerProductosVendidos(ventas),
                ventas: ventas.map(venta => ({
                    id: venta.id,
                    fecha: venta.createdAt,
                    total: venta.total,
                    vendidoPor: venta.usuario.nombres,
                    detalles: venta.detalles.map(detalle => ({
                        producto: detalle.producto.nombre,
                        cantidad: detalle.cantidad,
                        gramos: detalle.gramos,
                        precioUnitario: detalle.precioUnitario,
                        subtotal: detalle.subtotal,
                    })),
                })),
            };

            return resumen;

        } catch (error) {
            console.log(error);
            throw new Error(error)
        }
    }
}

