/* import { Between, Repository } from "typeorm";
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

 */
import { Between, Repository } from "typeorm";
import { Venta } from "./entities/venta.entity";
import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { CreateVentaDto, DetalleVentaDto } from "./dto/create-venta.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { DetalleVenta } from "./entities/detalle-venta.entity";
import { Productos } from "src/productos/entities/producto.entity";
import { DataSource } from "typeorm";
import { PrinterService, PrintTicketPayload, TicketItem } from "src/printer/printer.service";

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,

    @InjectRepository(DetalleVenta)
    private readonly detalleVentaRepository: Repository<DetalleVenta>,

    @InjectRepository(Productos)
    private readonly productoRepository: Repository<Productos>,

    private readonly printerService: PrinterService,

    private readonly dataSource: DataSource
  ) { }

  async crearVenta(createVentaDto: CreateVentaDto, usuarioId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const venta = this.ventaRepository.create({
        total: createVentaDto.total,
        usuarioId,
        cashRecibido: createVentaDto.cashRecibido,
      });
      let producto: TicketItem[] = [];
      // 🔐 IMPORTANTE: guardar siempre con el manager del queryRunner dentro de la transacción
      await queryRunner.manager.save(venta);

      for (const detalle of createVentaDto.detalles) {
        const producto = await queryRunner.manager.getRepository(Productos)
          .findOne({ where: { id: detalle.productoId } });

        if (!producto) {
          throw new NotFoundException(`Producto con ID ${detalle.productoId} no encontrado`);
        }

        const cantidad = Number(detalle.cantidad ?? 0);
        const gramos = Number(detalle.gramos ?? 0);

        if (cantidad <= 0 && gramos <= 0) {
          throw new BadRequestException(
            `Debe especificar una cantidad o gramos para el producto ${producto.nombre}`
          );
        }

        if (gramos > 0) {
          if (producto.stock < gramos) {
            throw new BadRequestException(`Stock insuficiente para el producto ${producto.nombre}`);
          }
        } else {
          if (producto.stock < cantidad) {
            throw new BadRequestException(`Stock insuficiente para el producto ${producto.nombre}`);
          }
        }
        producto.nombre = producto.nombre;
        producto.cantidad = detalle.cantidad ? detalle.cantidad : detalle.gramos;
        producto.precio = detalle.precioUnitario;

        const detalleVenta = this.detalleVentaRepository.create({
          ventaId: venta.id,
          productoId: detalle.productoId,
          ...(cantidad > 0 ? { cantidad } : {}),
          ...(gramos > 0 ? { gramos } : {}),
          precioUnitario: detalle.precioUnitario,
          subtotal: detalle.subtotal,
        });

        await queryRunner.manager.save(detalleVenta);

        producto.stock -= gramos > 0 ? gramos : cantidad;
        await queryRunner.manager.save(producto);
      }

      if (createVentaDto.imprimirFactura) {

        const payload: PrintTicketPayload = {
          items: producto,
          total: createVentaDto.total,
          numero: venta.id,
          fecha: new Date().toISOString().split("T")[0] + " " + new Date().toISOString().split("T")[1].split(".")[0],
          cliente: createVentaDto.usuario,
        };
        this.printerService.imprimirTicket(payload);
      }



      await queryRunner.commitTransaction();

      // ya fuera de la transacción, leemos la venta completa
      return this.ventaRepository.findOne({
        where: { id: venta.id },
        relations: ["detalles", "detalles.producto", "usuario"],
      });
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      console.error("Error al crear venta:", error);
      throw error instanceof Error
        ? error
        : new Error("Error desconocido al crear la venta");
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
        relations: ["usuario", "detalles", "detalles.producto"],
        order: {
          createdAt: "DESC",
        },
      });

      const resumen = {
        totalVentas: ventas.length,
        montoTotal: ventas.reduce((sum, venta) => sum + Number(venta.total), 0),
        productosVendidos: await this.obtenerProductosVendidos(ventas),
        ventas: ventas.map((venta) => ({
          id: venta.id,
          fecha: venta.createdAt,
          total: venta.total,
          vendidoPor: venta.usuario?.nombres,
          detalles: venta.detalles.map((detalle) => ({
            producto: detalle.producto?.nombre,
            cantidad: detalle.cantidad,
            gramos: detalle.gramos,
            precioUnitario: detalle.precioUnitario,
            subtotal: detalle.subtotal,
          })),
        })),
      };

      return resumen;
    } catch (error: any) {
      console.error("Error al generar el reporte de ventas:", error?.message);
      throw new Error(error?.message || "Error al generar el reporte de ventas");
    }
  }

  private async obtenerProductosVendidos(ventas: Venta[]) {
    const productosMap = new Map<
      string,
      {
        id: string;
        nombre: string;
        cantidadTotal: number;
        gramosTotal: number;
        montoTotal: number;
      }
    >();

    ventas.forEach((venta) => {
      venta.detalles.forEach((detalle) => {
        const producto = detalle.producto;
        if (!producto) return;

        if (!productosMap.has(producto.id)) {
          productosMap.set(producto.id, {
            id: producto.id,
            nombre: producto.nombre,
            cantidadTotal: 0,
            gramosTotal: 0,
            montoTotal: 0,
          });
        }

        const stats = productosMap.get(producto.id)!;
        stats.cantidadTotal += Number(detalle.cantidad ?? 0);
        stats.gramosTotal += Number(detalle.gramos ?? 0);
        stats.montoTotal += Number(detalle.subtotal ?? 0);
      });
    });

    return Array.from(productosMap.values()).sort(
      (a, b) => b.montoTotal - a.montoTotal
    );
  }

  /**
   * Resumen del día actual (igual a tu reporteXdia, pero reutilizando lógica).
   */
  async reporteXdia() {
    const now = new Date();

    const inicioDia = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0
    );
    const finDia = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    );

    return this.reporteVentas(inicioDia, finDia);
  }

  // ---------------------------------------------------------------------------
  //  🆕 MÉTODOS PARA GRÁFICAS (diarias y mensuales)
  // ---------------------------------------------------------------------------

  /**
   * Reporte para gráficas agrupado por día en un rango.
   * Ideal para un gráfico de líneas o barras (ventas por día).
   */
  async reporteGraficaDiaria(fechaInicial: Date, fechaFinal: Date) {
    const ventas = await this.ventaRepository.find({
      where: {
        createdAt: Between(fechaInicial, fechaFinal),
      },
      order: { createdAt: "ASC" },
    });

    const puntos = this.agruparVentas(ventas, "day");

    return {
      resumen: {
        totalVentas: ventas.length,
        montoTotal: ventas.reduce((sum, v) => sum + Number(v.total), 0),
      },
      grafica: puntos,
      // ejemplo de forma que puedes consumir en shadcn + Recharts:
      // grafica: Array<{ label: '2025-11-15', total: 120000, cantidadVentas: 5 }>
    };
  }

  /**
   * Reporte para gráficas agrupado por mes en un año.
   * Ideal para ver cómo se comporta el año completo.
   */
  async reporteGraficaMensual(year: number) {
    const fechaInicial = new Date(year, 0, 1, 0, 0, 0, 0);   // 1 enero
    const fechaFinal = new Date(year, 11, 31, 23, 59, 59, 999); // 31 diciembre

    const ventas = await this.ventaRepository.find({
      where: {
        createdAt: Between(fechaInicial, fechaFinal),
      },
      order: { createdAt: "ASC" },
    });

    const puntos = this.agruparVentas(ventas, "month");

    return {
      resumen: {
        totalVentas: ventas.length,
        montoTotal: ventas.reduce((sum, v) => sum + Number(v.total), 0),
      },
      grafica: puntos,
      // grafica: Array<{ label: '2025-01', total: 450000, cantidadVentas: 32 }>
    };
  }

  /**
   * Helper para agrupar ventas por día o por mes.
   * Devuelve un array ordenado listo para pintar en una gráfica.
   */
  private agruparVentas(
    ventas: Venta[],
    tipo: "day" | "month"
  ): Array<{
    key: string;
    label: string;
    total: number;
    cantidadVentas: number;
  }> {
    const mapa = new Map<
      string,
      { key: string; label: string; total: number; cantidadVentas: number }
    >();

    for (const venta of ventas) {
      const fecha = new Date(venta.createdAt);

      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, "0");
      const day = String(fecha.getDate()).padStart(2, "0");

      const key = tipo === "day" ? `${year}-${month}-${day}` : `${year}-${month}`;
      const label = tipo === "day" ? `${day}/${month}` : `${month}/${year}`;

      if (!mapa.has(key)) {
        mapa.set(key, {
          key,
          label,
          total: 0,
          cantidadVentas: 0,
        });
      }

      const item = mapa.get(key)!;
      item.total += Number(venta.total);
      item.cantidadVentas += 1;
    }

    return Array.from(mapa.values()).sort((a, b) => a.key.localeCompare(b.key));
  }
}
