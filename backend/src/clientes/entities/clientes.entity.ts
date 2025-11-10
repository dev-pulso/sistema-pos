import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity('clientes')
export class Clientes {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

}