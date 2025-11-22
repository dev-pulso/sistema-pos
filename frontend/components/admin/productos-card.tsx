// import { useState, useEffect } from "react";
// import { Edit, Plus, Trash2 } from "lucide-react";
// import { Button } from "../ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
// import { Badge } from "../ui/badge";
// import { Productos } from "@/config/app.interface";
// import DialogProducto from "./dialog-producto";
// import { formatNumberInputCOP } from "@/lib/utils";

// interface ProductoCardProps {
//     producto: Productos[];
//     isDialogOpen: boolean;
//     setIsDialogOpen: (isOpen: boolean) => void;
// }


// export default function ProductosCard({ producto, isDialogOpen, setIsDialogOpen }: ProductoCardProps) {
//     const [editingProduct, setEditingProduct] = useState<Productos | null>(null);
//     const [productosState, setProductosState] = useState<Productos[]>(producto);
//     useEffect(() => {
//         setProductosState(producto);
//     }, [producto]);


//     return (
//         <Card>
//             <CardHeader>
//                 <div className="flex items-center justify-between">
//                     <div>
//                         <CardTitle>Inventario de Productos</CardTitle>
//                         <CardDescription>Gestiona tu catálogo de productos</CardDescription>
//                     </div>
//                     <Button
//                         onClick={() => {
//                             setEditingProduct(null)
//                             setIsDialogOpen(true)
//                         }}
//                     >
//                         <Plus className="h-4 w-4 mr-2" />
//                         Nuevo Producto
//                     </Button>
//                     <DialogProducto
//                         isOpen={isDialogOpen}
//                         onClose={() => {
//                             setIsDialogOpen(false)
//                             setEditingProduct(null)
//                         }}
//                         editingProduct={editingProduct}
//                     />
//                 </div>
//             </CardHeader>
//             <CardContent>
//                 <Table>
//                     <TableHeader>
//                         <TableRow>
//                             <TableHead>Producto</TableHead>
//                             <TableHead>Categoría</TableHead>
//                             <TableHead className="text-right">Costo</TableHead>
//                             <TableHead className="text-right">Precio</TableHead>
//                             <TableHead className="text-right">Stock</TableHead>
//                             <TableHead className="text-right">Margen</TableHead>
//                             <TableHead className="text-right">Acciones</TableHead>
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                         {productosState.map((product) => {
//                             const margin = ((product.precio - product.costo) / product.precio) * 100
//                             return (
//                                 <TableRow key={product.id}>
//                                     <TableCell className="font-medium">{product.nombre}</TableCell>
//                                     <TableCell>
//                                         <Badge variant="secondary">{product.categoria.nombre}</Badge>
//                                     </TableCell>
//                                     <TableCell className="text-right">${formatNumberInputCOP(product.costo.toString())}</TableCell>
//                                     <TableCell className="text-right">${formatNumberInputCOP(product.precio.toString())}</TableCell>
//                                     <TableCell className="text-right">
//                                         <Badge variant={product.stock < 30 ? "destructive" : "default"}>{product.stock}</Badge>
//                                     </TableCell>
//                                     <TableCell className="text-right">
//                                         <span className="text-sm font-medium">{margin.toFixed(1)}%</span>
//                                     </TableCell>
//                                     <TableCell className="text-right">
//                                         <div className="flex justify-end gap-2">
//                                             <Button
//                                                 variant="ghost"
//                                                 size="icon"
//                                                 onClick={() => {
//                                                     setEditingProduct(product)
//                                                     setIsDialogOpen(true)
//                                                 }}
//                                             >
//                                                 <Edit className="h-4 w-4" />
//                                             </Button>
//                                             <Button variant="ghost" size="icon" onClick={() => console.log(product.id)}>
//                                                 <Trash2 className="h-4 w-4" />
//                                             </Button>
//                                         </div>
//                                     </TableCell>
//                                 </TableRow>
//                             )
//                         })}
//                     </TableBody>
//                 </Table>
//             </CardContent>
//         </Card>
//     );
// }
import { useState, useEffect, useMemo } from "react";
import { Edit, Plus, Trash2, AlertTriangle, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import DialogProducto from "./dialog-producto";
import { Productos } from "@/config/app.interface";
import { formatCurrency, formatNumberInputCOP } from "@/lib/utils";

interface ProductoCardProps {
  producto: Productos[];
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
}

const LOW_STOCK_THRESHOLD = 30; // 🔹 umbral de stock bajo

export default function ProductosCard({
  producto,
  isDialogOpen,
  setIsDialogOpen,
}: ProductoCardProps) {
  const [editingProduct, setEditingProduct] = useState<Productos | null>(null);
  const [productosState, setProductosState] = useState<Productos[]>(producto);

  // filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  useEffect(() => {
    setProductosState(producto);
  }, [producto]);

  // cuando el dialogo crea/actualiza un producto/ formatearlo con fomatcurrency

  const handleProductSaved = (prod: Productos) => {
    // formatear precio y costo a formato moneda
    setProductosState((prev) => {
      const index = prev.findIndex((p) => p.id === prod.id);
      if (index === -1) {
        return [...prev]; // nuevo
      }

      const clone = [...prev,]; // actualización
      clone[index] = prod;
      return clone;
    });
  };

  // 🔍 lista filtrada
  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return productosState.filter((p) => {
      const matchesName = term
        ? p.nombre.toLowerCase().includes(term)
        : true;

      const matchesLowStock = showLowStockOnly
        ? p.stock < LOW_STOCK_THRESHOLD
        : true;

      return matchesName && matchesLowStock;
    });
  }, [productosState, searchTerm, showLowStockOnly]);

  const handleExportExcel = () => {
    const dataToExport = filteredProducts.map((p) => ({
      Nombre: p.nombre,
      Precio: formatCurrency(p.precio),
      Categoria: p.categoria.nombre,
      Stock: p.stock,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");
    XLSX.writeFile(workbook, "productos.xlsx");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Inventario de Productos</CardTitle>
            <CardDescription>Gestiona tu catálogo de productos</CardDescription>
          </div>

          <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
            {/* 🔎 Buscador por nombre */}
            <div className="flex items-center gap-2">
              <Input
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64"
              />
            </div>

            {/* 🚨 Filtro stock bajo */}
            <div className="flex items-center gap-2">
              <Switch
                checked={showLowStockOnly}
                onCheckedChange={setShowLowStockOnly}
              />
              <span className="text-sm flex items-center gap-1 text-muted-foreground">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                Stock bajo (&lt; {LOW_STOCK_THRESHOLD})
              </span>
            </div>

            <Button variant="outline" onClick={handleExportExcel}>
              <Download className="h-4 w-4 mr-2" />
              Exportar Excel
            </Button>

            <Button
              onClick={() => {
                setEditingProduct(null);
                setIsDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Producto
            </Button>

            <DialogProducto
              isOpen={isDialogOpen}
              onClose={() => {
                setIsDialogOpen(false);
                setEditingProduct(null);
              }}
              editingProduct={editingProduct}
              onProductSaved={handleProductSaved}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="text-right">Costo</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Margen</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">
                  No se encontraron productos con los filtros actuales.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => {
                const margin =
                  product.precio > 0
                    ? ((product.precio - product.costo) / product.precio) * 100
                    : 0;

                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.nombre}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.categoria.nombre}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      ${formatNumberInputCOP(product.costo.toString())}
                    </TableCell>
                    <TableCell className="text-right">
                      ${formatNumberInputCOP(product.precio.toString())}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          product.stock < LOW_STOCK_THRESHOLD
                            ? "destructive"
                            : "default"
                        }
                      >
                        {product.stock}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-sm font-medium">
                        {margin.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingProduct(product);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => console.log("eliminar", product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
