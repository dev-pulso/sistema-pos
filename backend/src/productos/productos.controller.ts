import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ProductsService } from "./productos.services";
import { CrearProductDto } from "./dto/productos.dto";

@Controller('productos')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
    ) { }

    @Get()
    async findAll() {
        return this.productsService.buscarTodos();
    }
    @Get(':id')
    async findOne(id: string) {
        return this.productsService.buscarPorId(id);
    }
    @Post()
    async create(@Body() createProductDto: CrearProductDto) {
        return this.productsService.crear(createProductDto);
    }
    @Post(':id/stock')
    async updateStock(@Body() updateStockDto: { stock: number }, @Param('id') id: string) {
        return this.productsService.actualizarStock(id, updateStockDto.stock);
    }
}