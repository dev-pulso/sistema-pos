# ==========
# Etapa 1: deps (instalar dependencias)
# ==========
FROM node:18-alpine AS deps

WORKDIR /app

# Copiamos solo package.json y lockfile para aprovechar cache
COPY package.json package-lock.json* ./

RUN npm ci

# ==========
# Etapa 2: build (compilar Next)
# ==========
FROM node:18-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Si usas variables de entorno para build, se leen aquí (.env.production, etc.)
RUN npm run build

# ==========
# Etapa 3: runtime (producción)
# ==========
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Opcional: crear usuario no root
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs
USER nextjs

# Copiamos lo necesario desde el builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "run", "start"]
