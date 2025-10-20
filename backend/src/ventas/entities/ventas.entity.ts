import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from "typeorm";
import { VentaItem } from "./items-ventas.entity";
import { Users } from "src/users/entities/users.entity";
import { Clientes } from "src/clientes/entities/clientes.entity";

@Entity('ventas')
export class Ventas {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  descuento: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @ManyToOne(() => Clientes, customer => customer.ventas, { nullable: true })
  cliente: Clientes;

  @ManyToOne(() => Users, user => user.ventas)
  user: Users;

  @OneToMany(() => VentaItem, item => item.venta, { cascade: true })
  items: VentaItem[];

  @CreateDateColumn()
  createdAt: Date;
}