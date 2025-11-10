import { Exclude } from "class-transformer";
import { Venta } from "src/ventas/entities/venta.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";

export enum Rols {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  CASHIER = 'cashier',
}

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombres: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: Rols.CASHIER })
  rol: Rols;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Venta, ventas => ventas.usuario)
  ventas: Venta[];

  @Exclude()
  refreshToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}