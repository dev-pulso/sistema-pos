import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Venta } from './venta.entity';
import { Productos } from 'src/productos/entities/producto.entity';

@Entity('detalles_venta')
export class DetalleVenta {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Productos)
    @JoinColumn({ name: 'productoId' })
    producto: Productos;

    @Column()
    productoId: string;

    @ManyToOne(() => Venta, venta => venta.detalles)
    @JoinColumn({ name: 'ventaId' })
    venta: Venta;

    @Column()
    ventaId: string;

    @Column({ type: 'integer' })
    cantidad: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    precioUnitario: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    subtotal: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}