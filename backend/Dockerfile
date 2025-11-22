# ============================
# 1. Etapa de dependencias
# ============================
FROM node:18-alpine AS deps

WORKDIR /app

# Copiamos solo los archivos de dependencias
COPY package.json package-lock.json* ./

# Instalamos TODAS las dependencias (incluye dev para poder compilar)
RUN npm ci


# ============================
# 2. Etapa de build (NestJS → dist/)
# ============================
FROM node:18-alpine AS builder

WORKDIR /app

# Copiamos node_modules desde deps
COPY --from=deps /app/node_modules ./node_modules

# Copiamos el resto del código fuente
COPY . .

# Compilamos el proyecto NestJS
RUN npm run build


# ============================
# 3. Etapa de runtime (producción)
# ============================
FROM node:18-alpine AS runner

# Instalar tini para manejo correcto de señales (CTRL+C, reinicios, etc.)
RUN apk add --no-cache tini

WORKDIR /app

# Variables de entorno base
ENV NODE_ENV=production
ENV PORT=4000

# Crear usuario no root
RUN addgroup -S nestjs && adduser -S nestjs -G nestjs

# Copiamos solo package.json para instalar dependencias de producción
COPY package.json ./

# Instalamos SOLO dependencias de producción
RUN npm ci --omit=dev --no-audit --no-fund

# Copiamos el build compilado
COPY --from=builder /app/dist ./dist

# (Opcional) Si tienes algún asset estático para servir desde Nest:
# COPY --from=builder /app/public ./public

# Cambiamos a usuario no root
USER nestjs

# Exponemos el puerto del backend
EXPOSE 4000

# Usamos tini como init, y luego ejecutamos Node
ENTRYPOINT ["/sbin/tini", "--"]

# Comando final: arrancar app Nest ya compilada
CMD ["node", "dist/main.js"]
