import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Categorias } from 'src/categorias/entities/categoria.entity';



@Entity('productos')
export class Productos {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  barcode: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column()
  sku: string;

  @Column({ type: 'varchar', length: 30 })
  unidadMedida: string;

  @Column({ type: 'int' })
  precio: number;

  @Column({ type: 'int' })
  costo: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Categorias, category => category.productos)
  categoria: Categorias;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


