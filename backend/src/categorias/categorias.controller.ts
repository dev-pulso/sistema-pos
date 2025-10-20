import { Body, Controller, Get, Post } from "@nestjs/common";
import { CategoriasService } from "./categorias.services";
import { CategoriaDto } from "./dto/categoria.dto";


@Controller('categorias')
export class CategoriasController {
    constructor(
        private readonly categoriasService: CategoriasService,
    ) { }

    @Get()
    async getAll() {
        return this.categoriasService.findAll();
    }
    @Post()
    async create(@Body() categoria: CategoriaDto) {
        return this.categoriasService.create(categoria);
    }
}
