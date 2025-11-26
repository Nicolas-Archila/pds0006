# PDS006 - Sistema de Gestión con Arquitectura Limpia

> Aplicación backend con Bun, Elysia, despliegue en Azure y monitoreo con Axiom

## 👥 Integrantes del Equipo

- **Nicolas Hernandez Archila** 
- **Vanessa Alejandra Vasquez Martinez** 
- **Juan Jose Martinez Lotero** 

## 📋 Descripción del Proyecto

Este proyecto implementa una API RESTful utilizando arquitectura limpia (Clean Architecture) con las siguientes características:

- **Backend Framework**: Elysia.js con Bun runtime
- **Base de datos**: SQLite con Drizzle ORM
- **Autenticación**: Better Auth
- **Contenedorización**: Docker
- **CI/CD**: GitHub Actions
- **Despliegue**: Azure Container Apps
- **Monitoreo**: Axiom para logs y trazabilidad en tiempo real
- **Testing**: Tests automatizados con Bun y Hurl

### Arquitectura

El proyecto sigue los principios de Clean Architecture:

```
src/
├── adapter/           # Capa de adaptadores (API, Repositories)
│   ├── api/          # Controladores HTTP
│   ├── plugins/      # Plugins de Elysia (logging, etc.)
│   └── repository/   # Implementaciones de repositorios
├── core/
│   ├── domain/       # Entidades del dominio
│   ├── dto/          # Data Transfer Objects
│   ├── repository/   # Interfaces de repositorios
│   ├── service/      # Lógica de negocio
│   └── utils/        # Utilidades (logger, etc.)
└── index.ts          # Punto de entrada
```

## 📋 Requisitos Previos

- [Bun](https://bun.sh) >= 1.0.0
- [Docker](https://www.docker.com/) >= 20.10
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) (para deployment)
- Cuenta en [Axiom](https://axiom.co) (para logs)

## 🛠️ Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/pds006-frameworks.git
cd pds006-frameworks
```

### 2. Instalar dependencias
```bash
bun install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
```

Edita `.env` con tus valores:
```dotenv
BETTER_AUTH_SECRET=tu-secret-generado
BETTER_AUTH_URL=http://localhost:3000
DB_FILE_NAME=db.sqlite
AXIOM_TOKEN=tu-axiom-token
AXIOM_DATASET=pds006-logs
```

### 4. Ejecutar en desarrollo
```bash
bun run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🐳 Docker

### Desarrollo local
```bash
docker-compose up -d
```

### Build para producción
```bash
docker build -t pds006-app .
docker run -p 3000:3000 --env-file .env pds006-app
```

## 🧪 Testing

### Tests Unitarios (Bun)
```bash
# Ejecutar todos los tests
bun test

# Tests en modo watch
bun test:watch

# Type checking
bun run typecheck
```

### Tests de API (Hurl)
```bash
# Tests locales
hurl --variables-file tests/local.env --test tests/api.hurl

# Tests en producción
hurl --variables-file tests/production.env --test tests/api.hurl
```

Los tests de Hurl se ejecutan automáticamente en el pipeline de CI/CD después de cada deployment exitoso.

## 🚢 Pipeline CI/CD

El proyecto utiliza GitHub Actions para automatizar el proceso de CI/CD:

### Stages del Pipeline

1. **Test** 🧪
   - Instalación de dependencias con Bun
   - Ejecución de tests unitarios
   - Verificación de tipos TypeScript

2. **Build** 🏗️
   - Construcción de imagen Docker
   - Push a Azure Container Registry
   - Optimización con cache de Docker

3. **Deploy** 🚀
   - Autenticación en Azure
   - Deployment en Azure Container Apps
   - Actualización de variables de entorno

4. **API Tests** ✅
   - Ejecución de tests Hurl contra producción
   - Verificación de endpoints críticos
   - Validación de respuestas

### Triggers

- Push a `main`: Deploy completo a producción
- Push a `develop`: Solo tests
- Pull Request: Tests y validación

### Secrets Requeridos

```
AZURE_REGISTRY_NAME
AZURE_REGISTRY_USERNAME
AZURE_REGISTRY_PASSWORD
AZURE_APP_NAME
AZURE_RESOURCE_GROUP
AZURE_CREDENTIALS
BETTER_AUTH_SECRET
BETTER_AUTH_URL
AXIOM_TOKEN
AXIOM_DATASET
```

## 📊 Monitoreo y Trazabilidad

### Dashboard de Axiom

El proyecto integra Axiom para monitoreo en tiempo real:

- **URL Dashboard**: https://app.axiom.co
- **Dataset**: `vise-api-logs`
- **Métricas monitoreadas**:
  - Requests por endpoint
  - Tiempos de respuesta
  - Tasas de error
  - Logs de errores con stack traces
  - Actividad de usuarios

### Queries útiles en Axiom

**Requests por endpoint:**
```
['vise-api-logs']
| where level == "info"
| summarize count() by endpoint
```

**Errores en las últimas 24 horas:**
```
['vise-api-logs']
| where level == "error"
| where _time > ago(24h)
```

**Latencia promedio:**
```
['vise-api-logs']
| where duration > 0
| summarize avg(duration) by endpoint
```

### Alertas Configuradas

- Error rate > 5%
- Latencia promedio > 1000ms
- Disponibilidad < 99%

## 📁 Estructura del Proyecto

```
.
├── .github/
│   └── workflows/
│       └── ci.yml              # CI/CD Pipeline
├── src/
│   ├── adapter/                # Capa de adaptadores
│   │   ├── api/               # Controladores API
│   │   ├── plugins/           # Plugins de Elysia
│   │   └── repository/        # Implementaciones de repositorios
│   ├── core/
│   │   ├── domain/            # Entidades del dominio
│   │   ├── dto/               # Data Transfer Objects
│   │   ├── repository/        # Interfaces de repositorios
│   │   ├── service/           # Lógica de negocio
│   │   └── utils/             # Utilidades (logger, etc.)
│   └── index.ts               # Punto de entrada
├── Dockerfile                  # Docker para producción
├── docker-compose.yml          # Orquestación local
├── .dockerignore              # Archivos a ignorar en Docker
├── .env                       # Variables de entorno (no commitear)
├── .env.example               # Template de variables
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Scripts Disponibles

```bash
bun run dev          # Desarrollo con hot-reload
bun start            # Producción
bun test             # Ejecutar tests
bun test:watch       # Tests en watch mode
bun run typecheck    # Verificar tipos TypeScript
bun run build        # Build del proyecto
```

## 🌐 API Endpoints

### Health Check
```bash
GET /health
```

### Devices
```bash
GET    /api/devices
POST   /api/devices
GET    /api/devices/:id
PUT    /api/devices/:id
DELETE /api/devices/:id
```

### Photos
```bash
GET    /api/photos
POST   /api/photos
GET    /api/photos/:id
DELETE /api/photos/:id
```

### Medical Devices
```bash
GET    /api/medical
POST   /api/medical
GET    /api/medical/:id
PUT    /api/medical/:id
DELETE /api/medical/:id
```

### Computer Requests
```bash
GET    /api/computer
POST   /api/computer
GET    /api/computer/:id
PUT    /api/computer/:id
DELETE /api/computer/:id
```

## 🔐 Seguridad

- Autenticación JWT con Better Auth
- Secretos manejados con variables de entorno
- Usuario no-root en Docker
- HTTPS en producción (Azure)
- Rate limiting configurado

## 📝 Licencia

MIT

## 👥 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para soporte, abre un issue en GitHub o contacta al equipo de desarrollo.

---

Hecho con ❤️ por el equipo PDS006