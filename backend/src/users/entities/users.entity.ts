import { Exclude } from "class-transformer";
import { Ventas } from "src/ventas/entities/ventas.entity";
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

  @OneToMany(() => Ventas, sale => sale.user)
  ventas: Ventas[];
   @Column({ nullable: true })

  @Exclude()
  refreshToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}