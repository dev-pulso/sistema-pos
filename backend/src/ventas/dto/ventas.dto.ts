import { Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";

class VentasItemDto {
  @IsUUID()
  productoId: string;

  @IsNumber()
  cantidad: number;

  @IsNumber()
  precio: number;
}

export class CrearVentaDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VentasItemDto)
  items: VentasItemDto[];

  @IsNumber()
  subtotal: number;

  @IsNumber()
  @IsOptional()
  tax?: number;

  @IsNumber()
  @IsOptional()
  descuento?: number;

  @IsNumber()
  total: number;

  @IsUUID()
  @IsOptional()
  clienteId?: string;

  @IsUUID()
  userId: string;
}