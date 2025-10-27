import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Obtenemos el token del localStorage no está disponible aquí,
  // así que usamos cookies (más seguras)
  const token = request.cookies.get("auth-storage")?.value;

  // Rutas públicas que no requieren autenticación
  const publicPaths = ["/auth", "/auth/register", "/auth"];

  const isPublic = publicPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  // Si no hay token y no está en una ruta pública → redirigir a /auth/login
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // Si está autenticado e intenta ir a login/register → redirigir al home
  if (token && isPublic) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configura las rutas que el middleware debe proteger
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)", // todas excepto assets
  ],
};
