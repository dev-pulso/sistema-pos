import { Productos } from 'src/productos/entities/producto.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('categorias')
export class Categorias {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;  

  @OneToMany(() => Productos, product => product.categoria)
  productos: Productos[];
}