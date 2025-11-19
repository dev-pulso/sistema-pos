import { Body, Controller, Get, Post } from '@nestjs/common';
import { PrinterService } from './printer.service';

@Controller('printer')
export class PrinterController {
  constructor(private readonly printerService: PrinterService) { }

  // @Post('print')
  // async printTicket(@Body() ticketData: any) {
  //   return this.printerService.printTicket(ticketData)
  //   //return await this.printerService.printTicket(ticketData);
  // }

  // @Post('print-and-open-drawer')
  // async printTicketAndOpenDrawer(@Body() ticketData: any) {
  //   try {
  //     // Primero imprime el ticket
  //     const printResult = await this.printerService.printTicket(ticketData);
      
  //     if (!printResult.success) {
  //       return printResult;
  //     }

  //     // Luego abre el cajón
  //     const drawerResult = await this.printerService.openDrawer();
      
  //     return {
  //       success: true,
  //       message: 'Ticket impreso y cajón abierto',
  //       print: printResult,
  //       drawer: drawerResult,
  //     };
  //   } catch (error) {
  //     return {
  //       success: false,
  //       message: 'Error al imprimir y abrir cajón',
  //       error: error.message,
  //     };
  //   }
  // }

  // @Post('open-drawer')
  // async openDrawer() {
  //   return this.printerService.openDrawer();
  // }
}
