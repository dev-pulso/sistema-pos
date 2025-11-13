import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import { useResportesXdia } from "@/modules/ventas/hooks/useReporteVentas";
import { formatCurrency } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";

export default function VentasCard() {
    const [ventaSeleccionada, setVentaSeleccionada] = useState<any>(null);
    const data = useResportesXdia()
    console.log(data.data);


    return (
        <Card>
            <CardHeader>
                <CardTitle>Historial de Ventas</CardTitle>
                <CardDescription>Registro de todas las transacciones</CardDescription>
            </CardHeader>

            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID Venta</TableHead>
                            <TableHead>Fecha y Hora</TableHead>
                            <TableHead className="text-right">Items</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data.data?.totalVentas && data.data.totalVentas > 0 ? (
                            data.data.ventas.map((venta) => (
                                <TableRow key={venta.id} onClick={() => setVentaSeleccionada(venta)}>
                                    <TableCell className="font-medium">{venta.id}</TableCell>

                                    <TableCell>
                                        {new Date(venta.fecha).toLocaleString()}
                                    </TableCell>

                                    <TableCell className="text-right">
                                        {venta.detalles.length}
                                    </TableCell>

                                    <TableCell className="text-right font-medium">
                                        {formatCurrency(Number(data.data.montoTotal))}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No hay ventas
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            <Dialog open={!!ventaSeleccionada} onOpenChange={() => setVentaSeleccionada(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Detalle de la Venta #{ventaSeleccionada?.id}</DialogTitle>
                        <DialogDescription>
                            Realizada por <span className="font-semibold">{ventaSeleccionada?.vendidoPor}</span>
                            <br />
                            Fecha: {ventaSeleccionada && new Date(ventaSeleccionada.fecha).toLocaleString()}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 space-y-2">
                        {ventaSeleccionada?.detalles.map((item: any, i: number) => (
                            <div key={i} className="flex justify-between border-b py-2">
                                <span>{item.cantidad} × {item.producto}</span>
                                <span>{formatCurrency(Number(item.subtotal))}</span>
                            </div>
                        ))}
                    </div>

                    <DialogFooter>
                        <div className="w-full flex justify-between items-center pt-4 border-t">
                            <span className="font-semibold text-lg">Total:</span>
                            <span className="font-bold text-lg">{formatCurrency(Number(ventaSeleccionada?.total))}</span>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    )
}