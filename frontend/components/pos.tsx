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
import { ShoppingCart, Trash2 } from "lucide-react"
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


interface CartItem extends Productos {
    cantidad: number
}

export default function POS() {
    const [barcode, setBarcode] = useState("")
    const [cart, setCart] = useState<CartItem[]>([])
    const [selectedProduct, setSelectedProduct] = useState<Productos | null>(null)
    const [cantidad, setCantidad] = useState("1")
    const [isEditingQuantity, setIsEditingQuantity] = useState(false)
    const [descuento, setDescuento] = useState(0)
    const [cashReceived, setCashReceived] = useState("")
    const [unidadMedida, setUnidadMedida] = useState("unidad")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const { productos } = useProductos()
    const { setProductos, productos: productosStore } = useProductoStore()
    const { mutationVentas } = useVentas()
    const scanTimeout = useRef<NodeJS.Timeout>();
    const inputRef = useRef<HTMLInputElement>(null)



    useEffect(() => {
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

        const value = val.trim()
        setBarcode(value)

        // Reinicia el temporizador cada vez que llega una tecla
        if (scanTimeout.current) clearTimeout(scanTimeout.current)

        // Si pasan 200 ms sin más teclas, se asume que el lector terminó
        scanTimeout.current = setTimeout(() => {
            const code = value.trim()

            const product = productosStore.find(p => p.barcode === code)

            if (code.length > 0 && product) {
                handleAddProduct(product)
                setBarcode("") // limpia el input
            }
        }, 200)

    }

    const calcularPrecioUnidadMedida = (producto: Productos, cantidad: number, unidadMedida: string) => {
        const precioBase = producto.precio
        const base = producto.unidadMedida || "unidad"

        // Solo convertir si el base es kg
        if (base === "kg") {
            switch (unidadMedida) {
                case "kg":
                    return precioBase * cantidad
                case "g":
                    return precioBase * (cantidad / 1000)
                case "lb":
                    return precioBase * (cantidad * 0.453592)
                default:
                    return precioBase * cantidad
            }
        }
        return precioBase * cantidad
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

        const existing = cart.find(p => p.id === selectedProduct.id)
        if (existing) {
            setCart(prev =>
                prev.map(p =>
                    p.id === selectedProduct.id ? { ...p, cantidad: cantidadNum } : p
                )
            )
        } else {
            setCart(prev => [...prev, { ...selectedProduct, cantidad: cantidadNum }])
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


    let subtotal = cart.reduce((sum, p) => sum + p.precio * p.cantidad, 0)
    const iva = subtotal * 0.16
    const discount = subtotal * descuento / 100
    let total = subtotal - discount

    const cashAmount = cashReceived ? Number.parseInt(cashReceived.replace('.', '')) : 0

    const change = cashAmount - total

    const handleVentas = () => {
        const newDetalleVenta: DetalleVentas[] = []

        cart.map((venta) => {
            const detalleVenta: DetalleVentas = {
                productoId: venta.id,
                cantidad: venta.cantidad,
                precioUnitario: venta.precio,
                subtotal: subtotal
            }
            newDetalleVenta.push(detalleVenta)
        })

        const nuevaVenta: VentasDto = {
            detalles: newDetalleVenta,
            total: total
        }

        mutationVentas.mutate(nuevaVenta, {
            onSuccess() {
                abrirCajon()
                toast.success('Se registro la venta')
                setCart([])
                total = 0
                subtotal= 0
                setCashReceived('')
            },
            onError(error) {
                toast.error('error', {
                    description: error.message
                })

            },
        })
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* IZQUIERDA */}
            <div className="flex-1 flex flex-col p-6">
                <POSHeader />

                <Input
                    autoFocus
                    value={barcode}
                    onChange={async (e) => {
                        const value = e.target.value
                        handleScan(value)
                    }}
                    placeholder="Escanea o escribe código de barras..."
                    className="text-lg p-3 mb-4"
                />

                <div className="flex flex-wrap gap-4">
                    <ScrollArea className="flex-1">
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
                                            {product.stock} unid.
                                        </Badge>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>

            {/* DERECHA */}
            <div className="w-[380px] bg-white p-6 border-l flex flex-col">
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
                                    <p className="text-sm text-gray-500">
                                        {item.cantidad} {item.unidadMedida ?? "unid"} × ${item.precio.toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateCart(item, item.cantidad - 1)}
                                        disabled={item.cantidad <= 1}
                                        className="px-2 py-1 border rounded text-gray-600 hover:bg-gray-100"
                                    >–</button>

                                    <Input
                                        type="number"
                                        min="1"
                                        onFocus={() => setIsEditingQuantity(true)}
                                        onBlur={() => setIsEditingQuantity(false)}
                                        value={item.cantidad}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value)
                                            if (!isNaN(val) && val >= 1) {
                                                updateCart(item, val)
                                            }
                                        }}
                                        className="w-16 text-center"
                                    />
                                    <button
                                        onClick={() => updateCart(item, item.cantidad + 1)}
                                        className="px-2 py-1 border rounded text-gray-600 hover:bg-gray-100"
                                    >+</button>
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
                    <Button onClick={handleVentas} className="mt-4 w-full">Cobrar ${total.toLocaleString()}</Button>
                </div>
            </div>

            {/* MODAL DE CANTIDAD / UNIDAD */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Agregar producto</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-3">
                        <Label>Cantidad</Label>
                        <Input
                            type="number"
                            min="0"
                            value={cantidad}
                            onChange={(e) => setCantidad(e.target.value)}
                        />

                        <Label>Unidad de medida</Label>
                        <Select value={unidadMedida} onValueChange={setUnidadMedida}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar unidad" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="unidad">Unidad</SelectItem>
                                <SelectItem value="kg">Kg</SelectItem>
                                <SelectItem value="g">Gramos</SelectItem>
                                <SelectItem value="lb">Libras</SelectItem>
                            </SelectContent>
                        </Select>

                        {
                            selectedProduct &&
                            <p className="mt-3 text-green-700 font-medium">
                                Precio: ${calcularPrecioUnidadMedida(selectedProduct, parseFloat(cantidad || "0"), unidadMedida).toLocaleString()}
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
