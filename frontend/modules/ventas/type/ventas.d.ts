export interface VentasDto {
    detalles: DetalleVentas[]
    total: number
}
export interface DetalleVentas {
    productoId: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
}
export interface VentasResponse{
    id: string;
    total: number;
    metodoPago: string;
    clienteId: string;
    detalles: DetalleVenta[];
    createdAt: Date;
    updatedAt: Date;
}