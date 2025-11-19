import { Module } from "@nestjs/common";
import { PrinterController } from "./printer.controller";
import { PrinterService } from "./printer.service";
import { HttpModule } from "@nestjs/axios";

@Module({
    imports: [HttpModule],
    controllers: [PrinterController],
    providers: [PrinterService],
    exports: [PrinterService],
})
export class PrinterModule { }