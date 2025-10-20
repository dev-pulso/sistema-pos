import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

import { Repository } from "typeorm";

import { Categorias } from "./entities/categoria.entity";
import { CategoriaDto } from "./dto/categoria.dto";

@Injectable()
export class CategoriasService {
    constructor(
        @InjectRepository(Categorias)
        private readonly categoriasRepository: Repository<Categorias>,
    ) { }

    async findAll() {
        return this.categoriasRepository.find();
    }
    async create(categoria: CategoriaDto) {
        return this.categoriasRepository.save(categoria);
    }
}