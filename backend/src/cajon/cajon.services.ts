import { Injectable } from "@nestjs/common";
import { spawn } from "child_process";
import * as os from "os";



@Injectable()
export class CajonService {
    abrirCajon(): Promise<void> {
        return new Promise((resolve, reject) => {

            if (os.platform() === "linux") {


                const escpos = Buffer.from([0x1B, 0x70, 0x00, 0x19, 0xFA]);

                const lp = spawn("lp", ["-d", "pos"]);

                lp.stdin.write(escpos);
                lp.stdin.end();

                lp.on("close", (code) => {
                    if (code === 0) {
                        resolve();
                    } else {
                        reject(new Error(`lp returned code ${code}`));
                    }
                });
            }
            if(os.platform() === "win32") {
                const escpos = Buffer.from([0x1B, 0x70, 0x00, 0x19, 0xFA]);

                const printerName = "POS"; // Cambia esto al nombre de tu impresora

                const print = spawn("cmd", ["/c", `echo ${escpos.toString('hex')} > \\\\localhost\\${printerName}`]);

                print.on("close", (code) => {
                    if (code === 0) {
                        resolve();
                    } else {
                        reject(new Error(`Print command returned code ${code}`));
                    }
                });
            }

        });
    }
}

