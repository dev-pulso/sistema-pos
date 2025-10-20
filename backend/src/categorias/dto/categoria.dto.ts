import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CategoriaDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsOptional()
    descripcion: string;

}
