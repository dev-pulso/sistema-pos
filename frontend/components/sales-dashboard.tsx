"use client"

import { VentasPorFecha } from "./ventas-por-fecha"
import VentasPorFechaFix from "./ventas-por-fecha-fix"
export default function SalesDashboard() {
  return (
    <div className="w-full space-y-6">
      <VentasPorFecha />
    </div>
  )
}
