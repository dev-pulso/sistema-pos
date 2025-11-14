export interface VentasDto {
    detalles: DetalleVentas[]
    total: number
    cashRecibido: number
}
export interface DetalleVentas {
    productoId: string;
    gramos?: number;
    cantidad?: number;
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


export interface ReportesventasResponse {
    totalVentas:       number;
    montoTotal:        number;
    productosVendidos: ProductosVendido[];
    ventas:            Venta[];
}

export interface ProductosVendido {
    id:            string;
    nombre:        string;
    cantidadTotal: number;
    montoTotal:    number;
}

export interface Venta {
    id:         string;
    fecha:      Date;
    total:      string;
    vendidoPor: string;
    detalles:   Detalle[];
}

export interface Detalle {
    producto:       string;
    cantidad:       number;
    precioUnitario: string;
    subtotal:       string;
}