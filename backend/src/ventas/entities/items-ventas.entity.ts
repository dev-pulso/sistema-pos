import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Ventas } from "./ventas.entity";
import { Productos } from "src/productos/entities/producto.entity";

@Entity('venta_items')
export class VentaItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @ManyToOne(() => Ventas, venta => venta.items)
  venta: Ventas;

  @ManyToOne(() => Productos)
  productos: Productos;
}