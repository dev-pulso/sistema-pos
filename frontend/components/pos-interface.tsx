"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShoppingCart, Search, Package, LayoutDashboard, Trash2, Plus, Minus, Vegan, EllipsisVertical, LogOut } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { DropdownMenuContent, DropdownMenu, DropdownMenuTrigger, DropdownMenuItem } from "./ui/dropdown-menu"
import { POSHeader } from "./pos-header"
import { AvatarImage } from "./ui/avatar"
import Image from "next/image"

import LogoBebidas from '../public/img/bebidas.png'
import LogoLacteos from '../public/img/lacteos.png'
import LogoLimpieza from '../public/img/limpieza.png'
import LogoProteinas from '../public/img/proteina.png'
import LogoGranos from '../public/img/granos.png'
import LogoMascotas from '../public/img/mascotas.png'
import LogoAseo from '../public/img/aseo.png'
import LogoAceites from '../public/img/aceites.png'
import LogoFruver from '../public/img/fruver.png'


// Tipos de datos
interface Product {
  id: string
  name: string
  price: number
  category: string
  stock: number
  image?: string
}

interface CartItem extends Product {
  quantity: number
}

// Productos de ejemplo
const sampleProducts: Product[] = [
  { id: "1", name: "Café Americano", price: 3.5, category: "Fruver", stock: 50, },
  { id: "2", name: "Cappuccino", price: 4.5, category: "Bebidas", stock: 45 },
  { id: "3", name: "Croissant", price: 2.5, category: "Aseo", stock: 30 },
  { id: "4", name: "Sandwich", price: 6.0, category: "Granos", stock: 25 },
  { id: "5", name: "Ensalada", price: 7.5, category: "Mascotas", stock: 20 },
  { id: "6", name: "Jugo Natural", price: 4.0, category: "Bebidas", stock: 35 },
  { id: "7", name: "Muffin", price: 3.0, category: "Lacteos", stock: 40 },
  { id: "8", name: "Té Verde", price: 3.0, category: "Bebidas", stock: 60 },
]

export function POSInterface() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos")

  const categories = ["Todos", ...Array.from(new Set(sampleProducts.map((p) => p.category)))]

  // Filtrar productos
  const filteredProducts = sampleProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Agregar al carrito
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const getCategoryLogo = (category: string) => {
    console.log(category);


    switch (category) {
      case "Bebidas": return LogoBebidas
      case "Lácteos": return LogoLacteos
      case "Limpieza": return LogoLimpieza
      case "Proteinas": return LogoProteinas
      case "Granos": return LogoGranos
      case "Mascotas": return LogoMascotas
      case "Aseo": return LogoAseo
      case "Aceites": return LogoAceites
      case "Fruver": return LogoFruver
      default: return LogoBebidas
    }
  }

  // Actualizar cantidad
  const updateQuantity = (id: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === id) {
            const newQuantity = item.quantity + delta
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
          }
          return item
        })
        .filter((item) => item.quantity > 0)
    })
  }

  // Remover del carrito
  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  // Calcular totales
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.16 // 16% IVA
  const total = subtotal + tax

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
        {/* <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Vegan className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Granero el oriente</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <EllipsisVertical className="h-4 w-4 mr-2" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div> */}
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
                  <Image src={getCategoryLogo(product.category)} alt={product.category} width={80} height={80} />
                </div>
                <h3 className="font-semibold text-sm  text-balance">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
                  <Badge variant="secondary" className="text-xs">
                    {product.stock} unid.
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Panel derecho - Carrito */}
      <div className="w-96 bg-card border-l flex flex-col">
        {/* Header del carrito */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Carrito de Compra</h2>
            <Badge variant="secondary" className="ml-auto">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} items
            </Badge>
          </div>
        </div>

        {/* Items del carrito */}
        <ScrollArea className="flex-1 p-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ShoppingCart className="h-16 w-16 mb-4 opacity-20" />
              <p className="text-sm">El carrito está vacío</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <Card key={item.id} className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} c/u</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFromCart(item.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 bg-transparent"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 bg-transparent"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Totales y checkout */}
        <div className="p-4 border-t space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">IVA (16%):</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg">
              <span className="font-bold">Total:</span>
              <span className="font-bold text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
          <Button className="w-full" size="lg" onClick={processSale} disabled={cart.length === 0}>
            Procesar Venta
          </Button>
          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={() => setCart([])}
            disabled={cart.length === 0}
          >
            Limpiar Carrito
          </Button>
        </div>
      </div>
    </div>
  )
}
