import { Module } from "@nestjs/common";
import { CajonController } from "./cajon.controller";
import { CajonService } from "./cajon.services";

@Module({
  imports: [],
  controllers: [CajonController],
  providers: [CajonService],
  exports: [CajonService],
})
export class CajonModule {}
