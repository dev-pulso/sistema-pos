// import { Injectable } from '@nestjs/common';
// import * as fs from 'fs';
// import path from 'path';


// @Injectable()
// export class PrinterService {

//     private escpos: any;
//     private USB: any;

//     constructor() {        
//         // intenta asignar solo si existe
//         try { this.escpos.USB = this.USB; } catch (e) { /* noop */ }
//     }


//     getConnectedPrinters() {
//         try {
//             const devices = this.USB.findPrinter();
//             if (!devices?.length) {
//                 return { success: false, message: 'No se detectaron impresoras USB' };
//             }

//             const printers = devices.map((d: any, i: number) => ({
//                 index: i,
//                 vendorId: d.deviceDescriptor.idVendor,
//                 productId: d.deviceDescriptor.idProduct,
//             }));

//             return { success: true, printers };
//         } catch (error) {
//             return { success: false, message: 'Error listando impresoras', error: error.message };
//         }
//     }
//     diagnoseUsb() {
//         try {
//             const escposType = typeof this.escpos;
//             const usbType = typeof this.USB;
//             // propiedades relevantes
//             const escposKeys = Object.keys(this.escpos || {});
//             const usbKeys = Object.keys(this.USB || {});

//             // intentar llamar findPrinter si existe
//             let found: string | null = null;
//             try {
//                 if (typeof this.USB.findPrinter === 'function') {
//                     found = this.USB.findPrinter();
//                 } else if (typeof this.escpos.USB === 'function') {
//                     // no crear instancia aún, solo notificar que es constructor
//                     found = 'escpos.USB is constructor';
//                 } else {
//                     found = 'no findPrinter y escpos.USB no es constructor';
//                 }
//             } catch (err) {
//                 found = `error ${String(err)}`
//             }

//             return {
//                 success: true,
//                 escposType,
//                 usbType,
//                 escposKeys,
//                 usbKeys,
//                 findPrinterResult: found,
//             };
//         } catch (error) {
//             return { success: false, error: String(error) };
//         }
//     }



//     async printTicket(dto: any) {
//         try {
//             const printerPath = '/dev/usb/lp0'; // o /dev/usb/usblp0 según el sistema

//             // Construir ticket a partir del DTO recibido
//             const formatMoney = (n: number = 0) =>
//                 `${new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(n)} COP`;

//             const title = dto?.title || 'TICKET';
//             const items: Array<{ nombre: string; precio: number }> = Array.isArray(dto?.items)
//                 ? dto.items
//                 : [];

//             // ancho aproximado para imprimir en una sola línea (ajustar según impresora)
//             const LINE_WIDTH = 40;

//             const repeat = (ch: string, n: number) => ch.repeat(Math.max(0, n));
//             const center = (s: string) => {
//                 const trimmed = s.trim();
//                 if (trimmed.length >= LINE_WIDTH) return trimmed;
//                 const pad = Math.floor((LINE_WIDTH - trimmed.length) / 2);
//                 return repeat(' ', pad) + trimmed;
//             };

//             const formatLineItem = (name: string, price: number) => {
//                 const nameMax = LINE_WIDTH - 10; // reservar espacio para precio
//                 const safeName = (name || '').replace(/\s+/g, ' ').trim();
//                 const left = safeName.length > nameMax ? safeName.slice(0, nameMax - 1) + '…' : safeName;
//                 const priceStr = formatMoney(price);
//                 const space = Math.max(1, LINE_WIDTH - left.length - priceStr.length);
//                 return left + repeat(' ', space) + priceStr;
//             };

//             const lines: string[] = [];

//             // Agregar logo desde assets
//             try {
//                 const logoPath = path.join(__dirname, '../assets/logo.png');
//                 if (fs.existsSync(logoPath)) {
//                     // Leer la imagen y convertir a ESC/POS (nota: esto es simplificado)
//                     lines.push('\n');
//                     lines.push(center('🏪')); // emoji como representación visual del logo
//                     lines.push('\n');
//                 }
//             } catch (logoError) {
//                 console.log('Logo no encontrado, continuando sin él');
//             }

//             // Título con tamaño aumentado usando caracteres especiales ESC/POS
//             lines.push(repeat('-', LINE_WIDTH));
//             lines.push('\x1b[2J'); // Limpiar pantalla (ESC/POS)
//             lines.push('\x1b[!0'); // Tamaño normal
//             lines.push('\x1dh' + String.fromCharCode(0x80)); // Altura aumentada (comando ESC/POS)
//             lines.push(center(title.toUpperCase()));
//             lines.push('\x1dh' + String.fromCharCode(0x40)); // Volver a tamaño normal
//             lines.push(repeat('-', LINE_WIDTH));
//             if (items.length) {
//                 lines.push('ITEM' + repeat(' ', LINE_WIDTH - 4 - 8) + 'PRECIO'); // header
//                 lines.push(repeat('-', LINE_WIDTH));
//                 items.forEach(it => {
//                     lines.push(formatLineItem(it.nombre, it.precio));
//                 });
//                 lines.push(repeat('-', LINE_WIDTH));
//             } else {
//                 lines.push('(sin items)');
//                 lines.push(repeat('-', LINE_WIDTH));
//             }

//             const subtotal = typeof dto?.subtotal === 'number' ? dto.subtotal : items.reduce((s, i) => s + (i.precio || 0), 0);
//             const iva = typeof dto?.iva === 'number' ? dto.iva : 0;
//             const total = typeof dto?.total === 'number' ? dto.total : subtotal + iva;

//             const pushLabelValue = (label: string, value: number) => {
//                 const labelTxt = label + ':';
//                 const valueTxt = formatMoney(value);
//                 const space = Math.max(1, LINE_WIDTH - labelTxt.length - valueTxt.length);
//                 lines.push(labelTxt + repeat(' ', space) + valueTxt);
//             };

//             pushLabelValue('Subtotal', subtotal);
//             pushLabelValue('IVA', iva);
//             lines.push(repeat('-', LINE_WIDTH));
//             pushLabelValue('TOTAL', total);
//             lines.push(repeat('-', LINE_WIDTH));
//             lines.push('\n\n');
//             lines.push(center('GRACIAS POR SU COMPRA'));
//             lines.push('\n\n'); // espacio final
//             lines.push('\n\n'); // espacio final
//             lines.push('\x1B\x69'); // Corte total del papel
//             lines.push('\x07');
//             const text = lines.join('\n');

//             // Enviar el texto directamente a la ruta de la impresora
//             fs.writeFileSync(printerPath, text, 'utf8');

//             return { success: true, message: 'Ticket enviado a la impresora' };
//         } catch (error) {
//             console.error(error);
//             return { success: false, error: error.message };
//         }

//     }
//     /**
//      * Abrir cajón de dinero
//      */
//     async openDrawer() {
//         const printerPath = '/dev/usb/lp0';
//         try {
//             // Secuencia ESC/POS para abrir cajón (pin 2)
//             const openDrawerCmd = Buffer.from([0x1B, 0x70, 0x00, 0x40, 0x50]);
//             fs.writeFileSync(printerPath, openDrawerCmd);
//             return { success: true, message: 'Cajón abierto correctamente' };
//         } catch (err) {
//             return { success: false, error: err.message };
//         }
//     }
// }


import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';


export interface TicketItem {
  nombre: string;
  cantidad: number;
  precioUnitario: number;
}

export interface PrintTicketPayload {
  numero: string;          // Nº de venta / factura
  fecha: string;           // string legible: '2025-11-17 11:45'
  cliente?: string;        // opcional
  items: TicketItem[];
  total: number;
  pago?: number;           // efectivo entregado (opcional)
  cambio?: number;         // cambio devuelto (opcional)
}

@Injectable()
export class PrinterService {
  private readonly logger = new Logger(PrinterService.name);


  private readonly printAgentUrl = 'http://localhost:3001/print';

  constructor(private readonly http: HttpService) { }


  async imprimirTicket(venta: any) {
    try {
      await firstValueFrom(this.http.post(this.printAgentUrl, venta));
      this.logger.log(`Ticket enviado al Print Agent para venta #${venta.numero}`);
    } catch (error) {
      this.logger.error('Error enviando ticket al Print Agent', error);
      // aquí decides si lanzar excepción o solo loguear
    }
  }

}
