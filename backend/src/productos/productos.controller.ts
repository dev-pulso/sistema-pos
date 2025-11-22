import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from "@nestjs/common";
import { ProductsService } from "./productos.services";
import { CrearProductDto } from "./dto/productos.dto";
import { AuthGuard } from "@nestjs/passport";

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
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.CREATED)
    @Post()
    async create(@Body() createProductDto: CrearProductDto) {
        return this.productsService.crear(createProductDto);
    }
    @Post(':id/stock')
    async updateStock(@Body() updateStockDto: { stock: number }, @Param('id') id: string) {
        return this.productsService.actualizarStock(id, updateStockDto.stock);
    }
    @Post(':id')
    async update(@Body() updateProductDto: CrearProductDto, @Param('id') id: string) {
        return this.productsService.actualizar(id, updateProductDto);
    }
}