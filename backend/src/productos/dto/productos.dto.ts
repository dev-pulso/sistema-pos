import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID, MaxLength, Min, MinLength } from "class-validator";

enum UnidadMedida {
  UNIDAD = 'unidad',
  G = 'g',
  KG = 'kg',
  ML = 'ml',
  LT = 'lt',
}

export class CrearProductDto {
  @IsNotEmpty({ message: 'El nombre del producto es requerido' })
  @IsString({ message: 'El nombre debe ser un texto' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  nombre: string;

  @IsNotEmpty({ message: 'El precio es requerido' })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
  precio: number;

  @IsOptional()
  @IsNumber({}, { message: 'El stock debe ser un número' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock?: number;

  @IsOptional()
  @IsString({ message: 'El código de barras debe ser un texto' })
  @MinLength(8, { message: 'El código de barras debe tener al menos 8 caracteres' })
  @MaxLength(13, { message: 'El código de barras no puede exceder 13 caracteres' })
  barcode?: string;

  @IsString()
  unidadMedida: string;

  @IsOptional()
  @IsString({ message: 'El SKU debe ser un texto' })
  @MaxLength(50, { message: 'El SKU no puede exceder 50 caracteres' })
  sku?: string;

  @IsNumber()
  @IsOptional()
  costo: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNotEmpty({ message: 'El ID de categoría es requerido' })
  @IsUUID('4', { message: 'El ID de categoría debe ser un UUID válido' })
  categoriaId: string;
}