"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Trash2, Plus, Minus } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"


import useProductos from "@/modules/productos/hooks/useProductos"
import { Productos } from "@/config/app.interface"
import { formatNumberInputCOP } from "@/lib/utils"
import { useProductoStore } from "@/store/poducto.store"
import { POSHeader } from "./pos-header"

import LogoBebidas from '../public/img/bebidas.png'
import LogoLacteos from '../public/img/lacteos.png'
import LogoLimpieza from '../public/img/limpieza.png'
import LogoProteinas from '../public/img/proteina.png'
import LogoGranos from '../public/img/granos.png'
import LogoMascotas from '../public/img/mascotas.png'
import LogoAseo from '../public/img/aseo.png'
import LogoAceites from '../public/img/aceites.png'
import LogoFruver from '../public/img/fruver.png'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { ShoppingCart } from "./shopping-cart"


interface CartItem extends Productos {
  cantidad: number
}



export function POSInterface() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos")
  const [discount, setDiscount] = useState<string>('0%')

  const { productos } = useProductos()
  const { setProductos, productos: productosStore } = useProductoStore()

  useEffect(() => {
    if (productos.length > 0) setProductos(productos)

  }, [productos, setProductos])

  const descuentoValue = [
    { value: '0', label: '0%' },
    { value: '0.05', label: '5%' },
    { value: '0.10', label: '10%' },
    { value: '0.15', label: '15%' },
    { value: '0.20', label: '20%' },

  ]


  const categories = ["Todos", ...Array.from(new Set(productosStore.map((p) => p.categoria.nombre)))]
  // Filtrar productos
  const filteredProducts = productosStore.filter((product) => {
    const matchesSearch = product.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "Todos" || product.categoria.nombre === selectedCategory
    return matchesSearch && matchesCategory
  })


  // Agregar al carrito
  const addToCart = (product: Productos) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        return prevCart.map((item) => (item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item))
      }
      return [...prevCart, { ...product, cantidad: 1 }]
    })
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

  // Actualizar cantidad
  const updateQuantity = (id: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === id) {
            const newQuantity = item.cantidad + delta
            return newQuantity > 0 ? { ...item, cantidad: newQuantity } : item
          }
          return item
        })
        .filter((item) => item.cantidad > 0)
    })
  }

  const onClear=()=>{

  }

  // Remover del carrito
  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  // Calcular totales
  const subtotal = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
  const tax = subtotal * 0.16 // 16% IVA
  const descuento = subtotal * Number(discount)
  const total = subtotal - descuento

  // Procesar venta
  const processSale = () => {
    if (cart.length === 0) return
    alert(`Venta procesada: $${total.toFixed(2)}`)
    setCart([])
  }

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Panel izquierdo - Productos */}
      <div className="flex-1 flex flex-col p-4 gap-4">
        {/* Header */}
        <POSHeader />
        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Categorías */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="w-full justify-start">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Grid de productos */}
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow gap-2"
                onClick={() => addToCart(product)}
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

     <ShoppingCart items={cart} onClear={onClear} onUpdateQuantity={updateQuantity}/>
    </div>
  )
}
