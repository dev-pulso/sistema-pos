export function getBaseUrl() {
    // SSR: no existe window
    if (typeof window === "undefined") {
        return process.env.INTERNAL_API_URL || "http://backend:4000";
    }

    // Cliente: navegador
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
}
