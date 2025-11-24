# Usar la imagen oficial de Bun
FROM oven/bun:1 AS base
WORKDIR /app

# Etapa de dependencias
FROM base AS deps
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile --production

# Etapa de build (si necesitas transpilar TypeScript)
FROM base AS builder
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile
COPY . .
# Si tienes un comando de build, descoméntalo:
# RUN bun run build

# Etapa de producción
FROM base AS runner
WORKDIR /app

# Crear usuario no-root para seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 bunjs

# Crear directorio para la base de datos SQLite con permisos
RUN mkdir -p /app/data && chown -R bunjs:nodejs /app/data

# Copiar dependencias de producción
COPY --from=deps --chown=bunjs:nodejs /app/node_modules ./node_modules
COPY --chown=bunjs:nodejs . .

# Cambiar al usuario no-root
USER bunjs

# Exponer el puerto
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000
ENV DB_FILE_NAME=/app/data/db.sqlite

# Volumen para persistir la base de datos
VOLUME ["/app/data"]

# Comando para iniciar la aplicación
CMD ["bun", "run", "src/index.ts"]