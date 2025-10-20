import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('config')
  getConfig(): { port: number; environment: string } {
    return {
      port: this.configService.get<number>('PORT') ?? 3000,
      environment: this.configService.get<string>('NODE_ENV') ?? '',
    };
  }
}
