import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Productos } from "./entities/producto.entity";
import { Repository } from "typeorm";
import { CrearProductDto } from "./dto/productos.dto";
import { Categorias } from "src/categorias/entities/categoria.entity";
import { v4 as uuid } from 'uuid';
import { BarcodeAlreadyExistsException, CategoriaNotFoundException, CreacionProductoException, InvalidPrecioException, ProductoNotFoundException } from "./exceptions/productos.exeption";

@Injectable()
export class ProductsService {
    private readonly logger = new Logger(ProductsService.name);
    private barcodeCounter = 1000;
    constructor(
        @InjectRepository(Productos)
        private readonly productsRepository: Repository<Productos>,
        @InjectRepository(Categorias)
        private readonly categoriasRepo: Repository<Categorias>,
    ) { }

    async buscarTodos(): Promise<Productos[]> {
        try {
            return await this.productsRepository.find({
                relations: ['categoria'],
                order: { createdAt: 'DESC' },
            });
        } catch (error) {
            this.logger.error(`Error al obtener productos: ${error.message}`);
            throw new InternalServerErrorException('Error al obtener la lista de productos');
        }
    }
    async buscarPorId(id: string): Promise<Productos> {
        try {
            const producto = await this.productsRepository.findOne({
                where: { id },
                relations: ['categoria'],
            });

            if (!producto) {
                throw new BadRequestException(`Producto con ID ${id} no encontrado`);
            }

            return producto;
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException || error instanceof ProductoNotFoundException) {
                throw error;
            }

            this.logger.error(`Error al buscar producto: ${error.message}`);
            throw new InternalServerErrorException('Error al buscar el producto');
        }
    }

    async crear(producto: CrearProductDto): Promise<Productos> {
        this.logger.log(`Iniciando creación de producto: ${producto.nombre}`);

        try {
            // ✅ 1. Validar precio (validación adicional por si acaso)
            await this.validarPrecio(producto.precio);

            // ✅ 2. Validar y obtener categoría
            const categoria = await this.validarCategoria(producto.categoriaId);

            // ✅ 3. Validar código de barras único (si se proporciona)
            if (producto.barcode) {
                await this.validarBarcodeUnico(producto.barcode);
            }

            // ✅ 4. Crear la entidad del producto
            const newProducto = this.productsRepository.create({
                ...producto,
                categoria,
            });

            // ✅ 5. Generar barcode si no se envió
            if (!producto.barcode) {
                newProducto.barcode = await this.generateInternalBarcode();
                this.logger.log(`Barcode generado: ${newProducto.barcode}`);
            }

            // ✅ 6. Generar SKU incremental si no se envió
            if (!producto.sku) {
                newProducto.sku = await this.generateIncrementalSku();
                this.logger.log(`SKU generado: ${newProducto.sku}`);
            }

            // ✅ 7. Establecer stock predeterminado
            if (producto.stock == null) {
                newProducto.stock = 0;
            }

            // ✅ 8. Guardar el producto
            const productoGuardado = await this.productsRepository.save(newProducto);

            this.logger.log(`Producto creado exitosamente con ID: ${productoGuardado.id}`);
            return productoGuardado;

        } catch (error) {
            this.logger.error(`Error al crear producto: ${error.message}`, error.stack);

            // Si ya es una excepción HTTP de NestJS, re-lanzarla
            if (error instanceof BadRequestException ||
                error instanceof BarcodeAlreadyExistsException ||
                error instanceof CategoriaNotFoundException ||
                error instanceof InvalidPrecioException) {
                throw error;
            }

            // Para cualquier otro error inesperado
            throw new CreacionProductoException(error.message);
        }
    }
    private async validarPrecio(precio: number): Promise<void> {
        if (precio <= 0) {
            throw new InvalidPrecioException(precio);
        }
    }
    private async validarCategoria(categoriaId: string): Promise<Categorias> {
        try {
            const categoria = await this.categoriasRepo.findOne({
                where: { id: categoriaId },
            });

            if (!categoria) {
                throw new CategoriaNotFoundException(categoriaId);
            }

            return categoria;
        } catch (error) {
            if (error instanceof CategoriaNotFoundException) {
                throw error;
            }

            this.logger.error(`Error al buscar categoría: ${error.message}`);
            throw new InternalServerErrorException(
                'Error al validar la categoría en la base de datos',
            );
        }
    }

    /**
     * Valida que el código de barras sea único
     */
    private async validarBarcodeUnico(barcode: string): Promise<void> {
        try {
            const productoExistente = await this.productsRepository.findOne({
                where: { barcode },
            });

            if (productoExistente) {
                throw new BarcodeAlreadyExistsException(barcode);
            }
        } catch (error) {
            if (error instanceof BarcodeAlreadyExistsException) {
                throw error;
            }

            this.logger.error(`Error al validar barcode: ${error.message}`);
            throw new InternalServerErrorException(
                'Error al validar el código de barras en la base de datos',
            );
        }
    }

    private async generateInternalBarcode(): Promise<string> {
        let barcodeGenerado: string;
        let intentos = 0;
        const maxIntentos = 10;

        do {
            // Formato: PROD-timestamp-random
            const timestamp = Date.now().toString().slice(-6);
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            barcodeGenerado = `PROD${timestamp}${random}`;

            // Verificar si ya existe
            const existe = await this.productsRepository.findOne({
                where: { barcode: barcodeGenerado },
            });

            if (!existe) {
                return barcodeGenerado;
            }

            intentos++;
        } while (intentos < maxIntentos);

        throw new InternalServerErrorException(
            'No se pudo generar un código de barras único después de varios intentos',
        );
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
    async actualizar(
        id: string,
        producto: CrearProductDto,
    ): Promise<Productos> {
        this.logger.log(`Iniciando actualización de producto ID: ${id}`);

        try {
            // ✅ 1. Verificar que el producto existe
            const productoActual = await this.buscarPorId(id);

            // ✅ 2. Validar precio si se está actualizando
            if (producto.precio !== undefined) {
                await this.validarPrecio(producto.precio);
            }

            // ✅ 3. Validar categoría si se está actualizando
            let categoria: Categorias | undefined;
            if (producto.categoriaId) {
                categoria = await this.validarCategoria(producto.categoriaId);
            }

            // ✅ 4. Validar código de barras único si se está actualizando
            if (producto.barcode && producto.barcode !== productoActual.barcode) {
                await this.validarBarcodeUnico(producto.barcode);
            }
            

            // ✅ 6. Validar stock no negativo
            if (producto.stock !== undefined && producto.stock < 0) {
                throw new BadRequestException('El stock no puede ser negativo');
            }

            // ✅ 7. Preparar datos de actualización
            const datosActualizacion: any = { ...producto };

            // Eliminar categoriaId y agregar la relación completa si existe
            if (categoria) {
                delete datosActualizacion.categoriaId;
                datosActualizacion.categoria = categoria;
            } else if (producto.categoriaId !== undefined) {
                // Si se envió categoriaId pero no se validó (no debería pasar)
                delete datosActualizacion.categoriaId;
            }

            // ✅ 8. Actualizar el producto
            await this.productsRepository.update(id, datosActualizacion);

            // ✅ 9. Obtener y retornar el producto actualizado
            const productoActualizado = await this.buscarPorId(id);

            this.logger.log(
                `Producto actualizado exitosamente: ${productoActualizado.id}`,
            );
            return productoActualizado;

        } catch (error) {
            this.logger.error(
                `Error al actualizar producto ${id}: ${error.message}`,
                error.stack,
            );

            // Re-lanzar excepciones HTTP conocidas
            if (
                error instanceof BadRequestException ||
                error instanceof ProductoNotFoundException ||
                error instanceof BarcodeAlreadyExistsException ||
                error instanceof CategoriaNotFoundException ||
                error instanceof InvalidPrecioException
            ) {
                throw error;
            }

            // Error inesperado
            throw new InternalServerErrorException(
                `Error al actualizar el producto: ${error.message}`,
            );
        }
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