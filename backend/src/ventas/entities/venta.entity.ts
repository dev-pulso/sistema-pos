import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { DetalleVenta } from './detalle-venta.entity';
import { Users } from 'src/users/entities/users.entity';

@Entity('ventas')
export class Venta {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total: number;        

    @OneToMany(() => DetalleVenta, detalle => detalle.venta, { cascade: true })
    detalles: DetalleVenta[];

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    cashRecibido: number;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Users, user => user.ventas)
    @JoinColumn({ name: 'usuarioId' })
    usuario: Users;

    @Column({ nullable: true })
    usuarioId: string;

    @UpdateDateColumn()
    updatedAt: Date;
}