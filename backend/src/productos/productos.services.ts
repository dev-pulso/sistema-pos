import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Productos } from "./entities/producto.entity";
import { Repository } from "typeorm";
import { CrearProductDto } from "./dto/productos.dto";
import { Categorias } from "src/categorias/entities/categoria.entity";
import { v4 as uuid } from 'uuid';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Productos)
        private readonly productsRepository: Repository<Productos>,
        @InjectRepository(Categorias)
        private readonly categoriasRepo: Repository<Categorias>,
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

        const categoria = await this.categoriasRepo.findOne({
            where: { id: producto.categoriaId },
        });

        const codeBar = await this.productsRepository.findOne({
            where: { barcode: producto.barcode },
        });

        if (codeBar) {
            throw new Error('El código de barras ya existe');
        }

        if (!categoria) {
            throw new NotFoundException('Categoría no encontrada');
        }

        const newProducto = this.productsRepository.create({
            ...producto,
            categoria,
        });

        // 🔹 Generar barcode si no se envió
        if (!producto.barcode) {
            newProducto.barcode = this.generateInternalBarcode();
        }

        // 🔹 Generar SKU incremental si no se envió
        if (!producto.sku) {
            newProducto.sku = await this.generateIncrementalSku();
        }

        // 🔹 Stock obligatorio
        if (producto.stock == null) {
            newProducto.stock = 0;
        }

        return this.productsRepository.save(newProducto);
    }

     private generateInternalBarcode(): string {
    return 'INT-' + uuid().split('-')[0].toUpperCase(); // Ej: INT-4A9F2B
  }

  private async generateIncrementalSku(): Promise<string> {
    const lastProduct = await this.productsRepository
      .createQueryBuilder('producto')
      .orderBy('producto.createdAt', 'DESC')
      .getOne();

    let nextNumber = 1;

    if (lastProduct && lastProduct.sku) {
      const match = lastProduct.sku.match(/SKU-(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }

    return `SKU-${nextNumber.toString().padStart(4, '0')}`; // SKU-0001
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