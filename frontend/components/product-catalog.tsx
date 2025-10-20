"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Package } from "lucide-react"



// Datos de ejemplo de productos
const SAMPLE_PRODUCTS = [
  { id: "1", name: "Coca Cola 2L", price: 2.5, category: "Bebidas", stock: 45, barcode: "7501234567890" },
  { id: "2", name: "Pan Blanco", price: 1.2, category: "Panadería", stock: 30, barcode: "7501234567891" },
  { id: "3", name: "Leche Entera 1L", price: 1.8, category: "Lácteos", stock: 25, barcode: "7501234567892" },
  { id: "4", name: "Arroz 1kg", price: 3.5, category: "Granos", stock: 60, barcode: "7501234567893" },
  { id: "5", name: "Aceite Vegetal 1L", price: 4.2, category: "Aceites", stock: 20, barcode: "7501234567894" },
  { id: "6", name: "Huevos x12", price: 2.8, category: "Lácteos", stock: 35, barcode: "7501234567895" },
  { id: "7", name: "Azúcar 1kg", price: 1.5, category: "Granos", stock: 50, barcode: "7501234567896" },
  { id: "8", name: "Café Molido 500g", price: 5.5, category: "Bebidas", stock: 15, barcode: "7501234567897" },
  { id: "9", name: "Papel Higiénico x4", price: 3.2, category: "Limpieza", stock: 40, barcode: "7501234567898" },
  { id: "10", name: "Jabón Líquido 500ml", price: 2.9, category: "Limpieza", stock: 28, barcode: "7501234567899" },
  { id: "11", name: "Galletas Surtidas", price: 1.8, category: "Snacks", stock: 55, barcode: "7501234567800" },
  { id: "12", name: "Atún en Lata", price: 2.2, category: "Enlatados", stock: 42, barcode: "7501234567801" },
]

interface ProductCatalogProps {
  searchQuery: string
  viewMode: "grid" | "list"
  onAddToCart: (product: { id: string; name: string; price: number }) => void
}

export function ProductCatalog({ searchQuery, viewMode, onAddToCart }: ProductCatalogProps) {
  const filteredProducts = SAMPLE_PRODUCTS.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode.includes(searchQuery) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )
  const LogoBebidas = '../public/img/bebidas.png'
  const LogoLacteos = '../public/img/lacteos.png'
  const LogoLimpieza = '../public/img/limpieza.png'
  const LogoProteinas = '../public/img/proteina.png'
  const LogoGranos = '../public/img/granos.png'
  const LogoMascotas = '../public/img/mascotas.png'
  const LogoAseo = '../public/img/aseo.png'
  const LogoAceites = '../public/img/aceites.png'
  const LogoFruver = '../public/img/fruver.png'

  const getCategoryLogo = (category: string) => {
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





  if (viewMode === "list") {
    return (
      <div className="space-y-2">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="flex items-center justify-between p-4 transition-colors hover:bg-accent/50">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <img src={getCategoryLogo(product.category)} alt={product.category} className="h-12 w-12" />

              </div>
              <div>
                <h3 className="font-medium text-foreground">{product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {product.category} • Stock: {product.stock}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-xl font-bold text-foreground">${product.price.toFixed(2)}</p>
              <Button size="sm" onClick={() => onAddToCart(product)} className="gap-2">
                <Plus className="h-4 w-4" />
                Agregar
              </Button>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {filteredProducts.map((product) => (
        <Card key={product.id} className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
          <div className="flex h-32 items-center justify-center bg-muted">
            <img src={getCategoryLogo(product.category)} alt={product.category} className="h-12 w-12" />
          </div>
          <div className="flex flex-1 flex-col p-4">
            <div className="mb-2 flex-1">
              <h3 className="mb-1 font-semibold leading-tight text-foreground">{product.name}</h3>
              <p className="text-xs text-muted-foreground">{product.category}</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-foreground">${product.price.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Stock: {product.stock}</p>
              </div>
              <Button size="icon" onClick={() => onAddToCart(product)} className="h-9 w-9 shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
