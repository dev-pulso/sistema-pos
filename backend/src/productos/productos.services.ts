import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Productos } from "./entities/producto.entity";
import { Repository } from "typeorm";
import { CrearProductDto } from "./dto/productos.dto";

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Productos)
        private readonly productsRepository: Repository<Productos>,
    ) { }

    async buscarTodos() {
        const productos = await this.productsRepository.find({
            relations: ['categoria'],
            where: { isActive: true }   
        })
        return productos
    }
    async buscarPorId(id: string) {
        const producto = await this.productsRepository.findOne({
            where: {
                id: id,
            },
            relations: ['categoria'],
        });
        if (!producto) {
            throw new Error('Producto no encontrado');
        }
        return producto
    }
    async crear(producto: CrearProductDto) {
        const nuevoProducto = this.productsRepository.create({
            ...producto,
            categoria: {
                id: producto.categoriaId,
            }
        });
        return this.productsRepository.save(nuevoProducto);
    }
    async remover(id: string) {
        const producto = await this.buscarPorId(id);
        if (!producto) {
            throw new Error('Producto no encontrado');
        }
        await this.productsRepository.update(id, {
            isActive: false,
        });
        return {
            message: 'Producto eliminado',
        }
    }
    async actualizar(id: string, producto: Partial<CrearProductDto>) {
        const productoActual = await this.buscarPorId(id);
        if (!productoActual) {
            throw new Error('Producto no encontrado');
        }
        await this.productsRepository.update(id, {
            ...producto,
            categoria: {
                id: producto.categoriaId,
            }
        });
        return this.buscarPorId(id);
    }
    async actualizarStock(id: string, stock: number) {
        const productoActual = await this.buscarPorId(id);
        if (!productoActual) {
            throw new Error('Producto no encontrado');
        }
        productoActual.stock -= stock;
        await this.productsRepository.save(productoActual);
    }
}