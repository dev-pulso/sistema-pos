import { AdminPanel } from "@/components/admin-panel"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { Rols } from "@/config/app.interface"

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-background">
      <ProtectedRoute allowedRoles={[Rols.ADMIN, Rols.SUPER_ADMIN]}>
        <AdminPanel />
      </ProtectedRoute>
    </main>
  )
}
