import { HttpException, HttpStatus } from '@nestjs/common';

export class BarcodeAlreadyExistsException extends HttpException {
    constructor(barcode: string) {
        super(
            {
                statusCode: HttpStatus.CONFLICT,
                message: `El código de barras ${barcode} ya existe en el sistema`,
                error: 'Barcode Already Exists',
                code: 'BARCODE_DUPLICATE',
            },
            HttpStatus.CONFLICT,
        );
    }
}

export class InvalidPrecioException extends HttpException {
    constructor(precio: number) {
        super(
            {
                statusCode: HttpStatus.BAD_REQUEST,
                message: `El precio ${precio} no es válido. Debe ser mayor a 0`,
                error: 'Invalid Price',
                code: 'INVALID_PRICE',
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}
export class InvalidCostoException extends HttpException {
    constructor(costo: number) {
        super(
            {
                statusCode: HttpStatus.BAD_REQUEST,
                message: `El costo ${costo} no es válido. Debe ser mayor a 0`,
                error: 'Invalid Cost',
                code: 'INVALID_COST',
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}

export class CategoriaNotFoundException extends HttpException {
    constructor(categoriaId: string) {
        super(
            {
                statusCode: HttpStatus.NOT_FOUND,
                message: `La categoría con ID ${categoriaId} no fue encontrada`,
                error: 'Category Not Found',
                code: 'CATEGORY_NOT_FOUND',
            },
            HttpStatus.NOT_FOUND,
        );
    }
}

export class CreacionProductoException extends HttpException {
    constructor(details: string) {
        super(
            {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: `Error al crear el producto: ${details}`,
                error: 'Product Creation Failed',
                code: 'PRODUCT_CREATION_ERROR',
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
}

export class ProductoNotFoundException extends HttpException {
    constructor(productoId: string) {
        super(
            {
                statusCode: HttpStatus.NOT_FOUND,
                message: `El producto con ID ${productoId} no fue encontrado`,
                error: 'Product Not Found',
                code: 'PRODUCT_NOT_FOUND',
            },
            HttpStatus.NOT_FOUND,
        );
    }
}