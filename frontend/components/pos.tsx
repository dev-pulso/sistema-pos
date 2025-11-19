"use client"

import React, { useState, useRef, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Check, SearchIcon, ShoppingCart, Trash2, X } from "lucide-react"
import { Badge } from "./ui/badge"
import { formatCurrency, formatNumberInputCOP, sleep } from "@/lib/utils"
import { Separator } from "./ui/separator"
import { POSHeader } from "./pos-header"
import { ScrollArea } from "./ui/scroll-area"
import useProductos from "@/modules/productos/hooks/useProductos"
import { useProductoStore } from "@/store/poducto.store"
import { Card } from "./ui/card"
import Image from "next/image"
import { Productos } from "@/config/app.interface"


import LogoBebidas from '../public/img/bebidas.png'
import LogoLacteos from '../public/img/lacteos.png'
import LogoLimpieza from '../public/img/limpieza.png'
import LogoProteinas from '../public/img/proteina.png'
import LogoGranos from '../public/img/granos.png'
import LogoMascotas from '../public/img/mascotas.png'
import LogoAseo from '../public/img/aseo.png'
import LogoAceites from '../public/img/aceites.png'
import LogoFruver from '../public/img/fruver.png'
import useDebounce from "@/lib/customHooks/use-debounce-time"
import { abrirCajon } from "@/modules/ventas/services/ventas.service"
import { DetalleVentas, VentasDto } from "@/modules/ventas/type/ventas"
import useVentas from "@/modules/ventas/hooks/useVentas"
import { toast } from "sonner"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"
import { Checkbox } from "./ui/checkbox"
import { useAuthStore } from "@/store/auth.store"


interface CartItem extends Productos {
    cantidad: number,
    total?: number,
    pesoEnGramos?: number,
}

export default function POS() {
    const [barcode, setBarcode] = useState("")
    const [searchResults, setSearchResults] = useState<Productos[]>([]);
    const [cart, setCart] = useState<CartItem[]>([])
    const [selectedProduct, setSelectedProduct] = useState<Productos | null>(null)
    const [cantidad, setCantidad] = useState("1")
    const [isEditingQuantity, setIsEditingQuantity] = useState(false)
    const [editingQuantities, setEditingQuantities] = useState<Record<string | number, string>>({});
    const [descuento, setDescuento] = useState(0)
    const [cashReceived, setCashReceived] = useState("")
    const [unidadMedida, setUnidadMedida] = useState("unidad")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [imprimirTicket, setImprimirTicket] = useState(false)
    const { productos } = useProductos()
    const { setProductos, productos: productosStore } = useProductoStore()
    const { mutationVentas } = useVentas()
    const { user } = useAuthStore()
    const scanTimeout = useRef<NodeJS.Timeout>();
    const inputRef = useRef<HTMLInputElement>(null)



    useEffect(() => {
        if (productosStore.length > 0) setSearchResults(productosStore)
        if (productos.length > 0) setProductos(productos)
        if (!isEditingQuantity && inputRef.current) {
            inputRef.current.focus()
        }
    }, [productos, setProductos, isEditingQuantity, cart])



    //const filteredProducts = productosStore.filter((product) => {
    //  const matchesSearch = product.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    //const matchesCategory = selectedCategory === "Todos" || product.categoria.nombre === selectedCategory
    //return matchesSearch && matchesCategory
    //})


    // Escaneo o entrada manual
    const handleScan = (val: string) => {

        //determinamos si es numero o string
        const isNumber = /^\d+$/.test(val)
        const isString = /^[a-zA-Z\s]+$/.test(val)

        const value = val.trim()
        setBarcode(value)

        // Reinicia el temporizador cada vez que llega una tecla
        if (scanTimeout.current) clearTimeout(scanTimeout.current)

        // Si pasan 200 ms sin más teclas, se asume que el lector terminó
        scanTimeout.current = setTimeout(() => {
            const code = value.trim()

            let product = null
            if (isNumber) {
                product = productosStore.find(p => p.barcode === code)
                if (code.length > 0 && product) {
                    handleAddProduct(product)
                    setBarcode("") // limpia el input
                }
            } else if (isString) {
                const match = productosStore.find(p => p.nombre.toLowerCase().includes(code.toLowerCase()))

                setSearchResults(match ? [match] : [])
            }


        }, 200)

    }

    const calcularPrecioUnidadMedida = (producto: Productos, cantidad: number) => {
        const precioBase = producto.precio
        // const base = producto.unidadMedida || "unidad"

        // // Solo convertir si el base es kg
        // if (base === "kg") {
        //     switch (unidadMedida) {
        //         case "kg":
        //             return precioBase * cantidad
        //         case "g":
        //             return precioBase * (cantidad / 1000)
        //         case "lb":
        //             return precioBase * (cantidad * 0.453592)
        //         default:
        //             return precioBase * cantidad
        //     }
        // }
        return precioBase * (cantidad / 1000)
    }

    // Agregar producto (si aplica muestra modal)
    const handleAddProduct = (product: Productos) => {

        const existing = cart.find(p => p.id === product.id)
        if (existing) {
            existing.cantidad += 1
            setSelectedProduct(product)
            setCantidad(existing.cantidad.toString())
            // setUnidadMedida(existing.unidadMedida ?? "unidad")
            // setIsDialogOpen(true)
            return
        }

        // Categorías con unidades especiales
        const categoriasConUnidad = ["Verduras", "Frutas", "Granos"]

        if (categoriasConUnidad.includes(product.categoria.nombre)) {

            setSelectedProduct(product)
            setCantidad("1")
            setUnidadMedida("kg")

            setIsDialogOpen(true)
        } else {
            // Agregar directo con 1 unidad
            setCart(prev => [...prev, { ...product, cantidad: 1 }])
        }
    }

    // Confirmar desde modal
    const confirmAddToCart = () => {
        if (!selectedProduct) return
        const cantidadNum = parseFloat(cantidad)
        if (isNaN(cantidadNum) || cantidadNum <= 0) return


        const precioPorGram = calcularPrecioUnidadMedida(selectedProduct, cantidadNum)
        const precioCalculado = selectedProduct.precio * (cantidadNum / 1000)

        const existing = cart.find(p => p.id === selectedProduct.id)
        if (existing) {
            setCart(prev =>
                prev.map(p =>
                    p.id === selectedProduct.id
                        ? { ...p, pesoEnGramos: cantidadNum, total: precioCalculado }
                        : p
                )
            );
        } else {
            setCart(prev => [...prev, {
                ...selectedProduct,
                cantidad: 1,
                pesoEnGramos: cantidadNum,
                total: precioCalculado,
            }])
        }

        setIsDialogOpen(false)
        setSelectedProduct(null)
        setCantidad("1")
        setUnidadMedida("unidad")
    }

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(p => p.id !== id))
    }

    const updateCart = (product: Productos, cantidad: number) => {
        if (cantidad < 1) return
        setCart(prev =>
            prev.map(p => (p.id === product.id ? { ...p, cantidad } : p))
        )
    }
    const getCategoryLogo = (category: string) => {
        switch (category) {
            case "Bebidas": return LogoBebidas
            case "Lacteos": return LogoLacteos
            case "Limpieza": return LogoLimpieza
            case "Proteinas": return LogoProteinas
            case "Granos": return LogoGranos
            case "Mascotas": return LogoMascotas
            case "Aseo": return LogoAseo
            case "Aceites": return LogoAceites
            case "Verduras": return LogoFruver
            case "Frutas": return LogoFruver
            default: return LogoBebidas
        }
    }

    const descuentoSelect = [
        { label: '0%', value: 0 },
        { label: '5%', value: 5 },
        { label: '10%', value: 10 },
        { label: '15%', value: 15 },
        { label: '20%', value: 20 },
    ]


    let subtotal = cart.reduce((sum, p) => {
        if (p.pesoEnGramos) {
            return sum + (p.precio * p.pesoEnGramos) / 1000
        }
        return sum + (p.precio * p.cantidad)
    }, 0)
    const iva = subtotal * 0.16
    const discount = subtotal * descuento / 100
    let total = subtotal - discount

    const cashAmount = cashReceived ? Number.parseInt(cashReceived.replace('.', '')) : 0

    const change = cashAmount - total

    const handleVentas = () => {
        const newDetalleVenta: DetalleVentas[] = []

        cart.map((venta) => {
            if (venta.pesoEnGramos) {
                const detalleVenta: DetalleVentas = {
                    productoId: venta.id,
                    gramos: venta.pesoEnGramos,
                    precioUnitario: venta.precio,
                    subtotal: (venta.precio * venta.pesoEnGramos) / 1000
                }
                newDetalleVenta.push(detalleVenta)
            } else {
                const detalleVenta: DetalleVentas = {
                    productoId: venta.id,
                    cantidad: venta.cantidad,
                    precioUnitario: venta.precio,
                    subtotal: venta.precio * venta.cantidad
                }
                newDetalleVenta.push(detalleVenta)
            }
        })

        const nuevaVenta: VentasDto = {
            detalles: newDetalleVenta,
            total: total,
            cashRecibido: cashAmount,
            imprimirFactura: imprimirTicket,
            usuario: user?.nombres || ""
        }

        mutationVentas.mutate(nuevaVenta, {
            onSuccess() {
                abrirCajon()
                toast.success('Se registro la venta')
                setCart([])
                total = 0
                subtotal = 0
                setCashReceived('')
            },
            onError(error: any) {
                const errorMessage = error.response?.data?.message || 'Error desconocido';
                
                toast.error('Error al registrar venta', {
                    description: errorMessage
                })

            },
        })
    }

    const convertirGramosAKg = (gramos: number) => {
        return gramos / 1000;
    }

    return (
        <div className="flex h-screen">
            {/* IZQUIERDA */}
            <div className="flex-1 flex flex-col p-6">
                <POSHeader />

                {/* <Input
                    autoFocus
                    value={barcode}
                    onChange={async (e) => {
                        const value = e.target.value
                        handleScan(value)
                    }}
                    placeholder="Escanea o escribe código de barras..."
                    className="text-lg p-3 mb-4"
                /> */}
                <InputGroup className="text-lg p-3 mb-4">
                    <InputGroupInput placeholder="Buscar por nombre o código de barras..." autoFocus
                        value={barcode}
                        onChange={async (e) => {
                            const value = e.target.value
                            handleScan(value)
                        }} />
                    <InputGroupAddon>
                        <SearchIcon />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end" onClick={() => setBarcode('')} className="cursor-pointer">
                        <X />
                    </InputGroupAddon>
                </InputGroup>

                <div className="flex flex-wrap gap-4 ">
                    <ScrollArea className="flex-1 overflow-y-auto h-[calc(100vh-150px)]">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {productosStore.map((product) => (
                                <Card
                                    key={product.id}
                                    className="p-4 cursor-pointer hover:shadow-md transition-shadow gap-2"
                                    onClick={() => handleAddProduct(product)}
                                >
                                    <div className="h-16 rounded-md flex items-center justify-center">
                                        <Image src={getCategoryLogo(product.categoria.nombre)} alt={product.categoria.nombre} width={80} height={80} />
                                    </div>
                                    <h3 className="font-semibold text-sm  text-balance">{product.nombre}</h3>
                                    <div className="flex items-center justify-between">
                                        <p className="text-lg font-bold text-primary">$ {formatNumberInputCOP(product.precio.toString())}</p>
                                        <Badge variant="secondary" className="text-xs">
                                            {product.unidadMedida === 'kg' ? convertirGramosAKg(product.stock) + 'kg' : product.stock + 'unid.'}
                                        </Badge>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>

            {/* DERECHA */}
            <div className="w-[380px] p-6 border-l flex flex-col">
                <div className="flex items-center justify-between mb-4">

                    <h2 className="text-xl font-semibold mb-4">
                        <ShoppingCart className="inline-block mr-2" />
                        Carrito</h2>

                    <Badge>
                        {cart.reduce((sum, item) => sum + item.cantidad, 0)} items
                    </Badge>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3">
                    {cart.map((item) => (
                        <div key={item.id} className="border-b pb-2">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{item.nombre}</p>

                                    {
                                        item.pesoEnGramos ? (
                                            <p className="text-sm text-gray-500">
                                                {item.pesoEnGramos} g × {formatCurrency(item.total ?? 0)}
                                            </p>
                                        )
                                            : (
                                                <p className="text-sm text-gray-500">
                                                    {item.cantidad} {item.unidadMedida ?? "unid"} × {formatCurrency(item.precio)}
                                                </p>
                                            )
                                    }
                                    {/* <p className="font-medium">{item.nombre}</p>
                                    <p className="text-sm text-gray-500">
                                        {item.cantidad} {item.unidadMedida ?? "unid"} × ${item.precio.toLocaleString()}
                                    </p> */}
                                </div>
                                <div className="flex items-center gap-2">
                                    {!item.pesoEnGramos && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    const newCantidad = item.cantidad - 1;
                                                    if (newCantidad < 1) return;
                                                    updateCart(item, newCantidad);
                                                    setEditingQuantities((prev) => ({
                                                        ...prev,
                                                        [item.id]: String(newCantidad),
                                                    }));
                                                }}
                                                disabled={item.cantidad <= 1}
                                                className="px-2 py-1 border rounded text-gray-600 hover:bg-gray-100"
                                            >
                                                –
                                            </button>

                                            <Input
                                                type="number"
                                                min="1"
                                                value={editingQuantities[item.id] ?? String(item.cantidad)}
                                                className="w-16 text-center"
                                                onFocus={() => {
                                                    setIsEditingQuantity(true);
                                                    // si aún no hay valor en edición, inicializar con la cantidad actual
                                                    setEditingQuantities((prev) => ({
                                                        ...prev,
                                                        [item.id]: prev[item.id] ?? String(item.cantidad),
                                                    }));
                                                }}
                                                onBlur={() => {
                                                    setIsEditingQuantity(false);

                                                    // al salir del input, normalizamos el valor
                                                    const raw = editingQuantities[item.id] ?? String(item.cantidad);
                                                    const parsed = parseInt(raw, 10);

                                                    if (isNaN(parsed) || parsed < 1) {
                                                        // si está vacío o es inválido, volvemos al valor actual (>=1)
                                                        const safeCantidad = item.cantidad || 1;
                                                        setEditingQuantities((prev) => ({
                                                            ...prev,
                                                            [item.id]: String(safeCantidad),
                                                        }));
                                                        updateCart(item, safeCantidad);
                                                    } else {
                                                        updateCart(item, parsed);
                                                        setEditingQuantities((prev) => ({
                                                            ...prev,
                                                            [item.id]: String(parsed),
                                                        }));
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    const value = e.target.value;

                                                    // permitimos vacío para que el usuario pueda borrar y reescribir
                                                    setEditingQuantities((prev) => ({
                                                        ...prev,
                                                        [item.id]: value,
                                                    }));

                                                    // actualizar en tiempo real solo cuando el valor es válido
                                                    const parsed = parseInt(value, 10);
                                                    if (!isNaN(parsed) && parsed >= 1) {
                                                        updateCart(item, parsed);
                                                    }
                                                }}
                                            />

                                            <button
                                                onClick={() => {
                                                    const newCantidad = item.cantidad + 1;
                                                    updateCart(item, newCantidad);
                                                    setEditingQuantities((prev) => ({
                                                        ...prev,
                                                        [item.id]: String(newCantidad),
                                                    }));
                                                }}
                                                className="px-2 py-1 border rounded text-gray-600 hover:bg-gray-100"
                                            >
                                                +
                                            </button>
                                        </>)}
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-500 hover:text-red-700"
                                    ><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t mt-4 pt-4 text-sm">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="font-medium text-foreground">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Descuento</span>
                            <Select
                                value={descuento.toString()}
                                onValueChange={(value) => setDescuento(Number(value))}
                            >
                                <SelectTrigger className="w-[100px]">
                                    <SelectValue placeholder="0%" />
                                </SelectTrigger>
                                <SelectContent>
                                    {descuentoSelect.map((option) => (
                                        <SelectItem key={option.value} value={option.value.toString()}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                            <span className="text-lg font-semibold text-foreground">Total</span>
                            <span className="text-2xl font-bold text-foreground">{formatCurrency(total)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm font-semibold text-foreground">Imprimir Ticket</span>
                            <Checkbox checked={imprimirTicket} onCheckedChange={() => setImprimirTicket((prev) => !prev)} />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">

                                <label className="text-sm font-medium text-foreground">Efectivo Recibido</label>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={cashReceived}
                                    onChange={(e) => {
                                        const formatted = formatNumberInputCOP(e.target.value);
                                        setCashReceived(formatted)
                                    }
                                    }
                                    className="text-lg w-32 text-right"
                                />
                            </div>
                            {cashAmount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Cambio</span>
                                    <span className={`font-bold ${change >= 0 ? "text-foreground" : "text-destructive"}`}>
                                        {formatCurrency(change)}
                                    </span>
                                </div>
                            )}

                        </div>
                    </div>
                    <Button disabled={cart.length === 0} onClick={handleVentas} className="mt-4 w-full cursor-pointer">Cobrar ${total.toLocaleString()}</Button>
                </div>
            </div>

            {/* MODAL DE CANTIDAD / UNIDAD */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Agregar producto</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-3">
                        <Label>Gramos</Label>
                        <Input
                            type="number"
                            min="0"
                            value={cantidad}
                            onChange={(e) => setCantidad(e.target.value)}
                        />

                        {/* <Select value={unidadMedida} onValueChange={setUnidadMedida}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar unidad" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="unidad">Unidad</SelectItem>
                                <SelectItem value="kg">Kg</SelectItem>
                                <SelectItem value="g">Gramos</SelectItem>
                                <SelectItem value="lb">Libras</SelectItem>
                            </SelectContent>
                        </Select> */}

                        {
                            selectedProduct &&
                            <p className="mt-3 text-green-700 font-medium">
                                Precio:{formatCurrency(calcularPrecioUnidadMedida(selectedProduct, parseFloat(cantidad || "0")))}
                            </p>
                        }

                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={confirmAddToCart}>Agregar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    )
}
