import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

enum UnidadMedida {
  UNIDAD = 'unidad',
  G = 'g',
  KG = 'kg',
  ML = 'ml',
  LT = 'lt',
}

export class CrearProductDto {
  @IsString()
  nombre: string;

  @IsString()
  barcode: string;


  @IsEnum(() => UnidadMedida)
  unidadMedida: UnidadMedida;
  

  @IsNumber()
  cantidad: number;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  precio: number;

  @IsNumber()
  @IsOptional()
  costo: number;

  @IsNumber()
  @IsOptional()
  stock?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsUUID()
  categoriaId: string;
}