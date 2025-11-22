import { Controller, Post } from "@nestjs/common";
import { CajonService } from "./cajon.services";

@Controller('cajon')
export class CajonController {
    constructor(
        private readonly cajonServices: CajonService,
    ) { }

    @Post()
    async abirCajon() {
        await this.cajonServices.abrirCajon();
        return { status: 'Ok', message: 'Cajón abierto' };
    }
    
}