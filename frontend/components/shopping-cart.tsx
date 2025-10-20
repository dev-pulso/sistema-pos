"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, Minus, CarIcon as CartIcon, CreditCard } from "lucide-react"
import { useState } from "react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface ShoppingCartProps {
  items: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onClear: () => void
}

export function ShoppingCart({ items, onUpdateQuantity, onClear }: ShoppingCartProps) {
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash")
  const [cashReceived, setCashReceived] = useState("")

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.16 // 16% IVA
  const total = subtotal + tax

  const cashAmount = Number.parseFloat(cashReceived) || 0
  const change = cashAmount - total

  const handleCheckout = () => {
    if (items.length === 0) return

    if (paymentMethod === "cash" && cashAmount < total) {
      alert("El monto recibido es insuficiente")
      return
    }

    alert(
      `Venta completada!\nTotal: $${total.toFixed(2)}\n${paymentMethod === "cash" ? `Cambio: $${change.toFixed(2)}` : "Pago con tarjeta"}`,
    )
    onClear()
    setCashReceived("")
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header del carrito */}
      <div className="border-b border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CartIcon className="h-5 w-5 text-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Carrito</h2>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {items.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          {items.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onClear} className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Lista de items */}
      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <CartIcon className="mb-4 h-16 w-16 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">El carrito está vacío</p>
            <p className="text-xs text-muted-foreground">Agrega productos para comenzar</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.id} className="p-3">
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium leading-tight text-foreground">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive hover:text-destructive"
                    onClick={() => onUpdateQuantity(item.id, 0)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 bg-transparent"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium text-foreground">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 bg-transparent"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-base font-bold text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Resumen y pago */}
      {items.length > 0 && (
        <div className="border-t border-border bg-card p-4">
          <div className="space-y-3">
            {/* Totales */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">IVA (16%)</span>
                <span className="font-medium text-foreground">${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-foreground">Total</span>
                <span className="text-2xl font-bold text-foreground">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Método de pago */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Método de Pago</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={paymentMethod === "cash" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("cash")}
                  className="w-full"
                >
                  Efectivo
                </Button>
                <Button
                  variant={paymentMethod === "card" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("card")}
                  className="w-full"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Tarjeta
                </Button>
              </div>
            </div>

            {/* Input de efectivo */}
            {paymentMethod === "cash" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Efectivo Recibido</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  className="text-lg"
                />
                {cashAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cambio</span>
                    <span className={`font-bold ${change >= 0 ? "text-foreground" : "text-destructive"}`}>
                      ${Math.max(0, change).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Botón de cobrar */}
            <Button size="lg" className="w-full text-base font-semibold" onClick={handleCheckout}>
              Cobrar ${total.toFixed(2)}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
