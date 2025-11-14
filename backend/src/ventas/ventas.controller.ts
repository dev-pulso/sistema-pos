import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { VentasService } from "./ventas.services";
import { CreateVentaDto } from "./dto/create-venta.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller('ventas')
export class VentasController {
    constructor(
        private readonly ventasService: VentasService,
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async crearVenta(@Body() dto: CreateVentaDto, @Req() req: any) {
        console.log(dto);
        
        try {
            const usuarioId = req.user?.id
            const response = await this.ventasService.crearVenta(dto, usuarioId)
            return response
        } catch (error) {
            throw error
        }
    }

    // @UseGuards(AuthGuard('jwt'))
    @Get()
    async reporteVentas(
        @Query('fechaInicial') fechaInicial: Date,
        @Query('fechaFinal') fechaFinal: Date,) {
        try {
            fechaInicial = new Date(`${fechaInicial}:00:00:00`);
            fechaFinal = new Date(`${fechaFinal}:23:59:59`);
            const response = await this.ventasService.reporteVentas(fechaInicial, fechaFinal)
            return response
        } catch (error) {
            throw new Error(error.message || 'Error al generar el reporte de ventas');
        }
    }
    @UseGuards(AuthGuard('jwt'))
    @Get('dia')
    async reporteXdia() {
        try {
            const response = await this.ventasService.reporteXdia()
            return response

        } catch (error) {
            console.log('Error en reporteVentas:', error);
            throw new Error(error.message || 'Error al generar el reporte de ventas');
        }
    }


}