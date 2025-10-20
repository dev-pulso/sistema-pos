import { Controller } from "@nestjs/common";
import { VentasService } from "./ventas.services";

@Controller('ventas')
export class VentasController {
    constructor(
        private readonly ventasService: VentasService,
    ) { }

    
}