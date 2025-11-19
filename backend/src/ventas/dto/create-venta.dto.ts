import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class DetalleVentaDto {
    @IsUUID()
    @IsNotEmpty()
    productoId: string;

    @IsNumber()
    @IsOptional()
    cantidad: number;

    @IsNumber()
    @IsOptional()
    gramos: number;

    @IsNumber()
    @IsNotEmpty()
    precioUnitario: number; 

    @IsNumber()
    @IsNotEmpty()
    subtotal: number;
    
}

export class CreateVentaDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DetalleVentaDto)
    detalles: DetalleVentaDto[];

    @IsNumber()
    @IsNotEmpty()
    total: number;

    @IsNumber()
    @IsNotEmpty()
    cashRecibido: number;

    @IsBoolean()
    imprimirFactura: boolean;

    @IsString()
    usuario: string;
}