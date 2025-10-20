import { TypeOrmModule } from "@nestjs/typeorm";
import { Clientes } from "./entities/clientes.entity";
import { Module } from "@nestjs/common";

@Module({
    imports: [TypeOrmModule.forFeature([Clientes])],
    controllers: [],
    providers: [],
    exports: [],
})
export class ClientesModule { }