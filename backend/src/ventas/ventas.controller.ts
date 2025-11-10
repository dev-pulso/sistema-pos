import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { VentasService } from "./ventas.services";
import { CreateVentaDto } from "./dto/create-venta.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller('ventas')
export class VentasController {
    constructor(
        private readonly ventasService: VentasService,
    ) { }

    //@UseGuards(AuthGuard('jwt'))
    @Post()
    async crearVenta(@Body() dto: CreateVentaDto, @Req() req) {
        try {
            const usuarioId = req.user?.id
            const response = await this.ventasService.crearVenta(dto, usuarioId)
            return response
        } catch (error) {
            throw Error(error)
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async reporteVentas(
        @Query('fechaInicial') fechaInicial: string,
        @Query('fechaFinal') fechaFinal: string,) {
        try {
            const response = await this.ventasService.reporteVentas(
                new Date(fechaInicial),
                new Date(fechaFinal)
            )
            return response
        } catch (error) {
            throw Error(error)
        }
    }


}