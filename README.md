1. URL DE LA PAGINA 

https://viseapiarchi.orangeglacier-66d09494.brazilsouth.azurecontainerapps.io

2. DESCRIPCION DEL PROYECTO 

Este proyecto implementa una API RESTful utilizando arquitectura limpia (Clean Architecture) con las siguientes características:

Backend Framework: Elysia.js con Bun runtime
Base de datos: SQLite con Drizzle ORM
Autenticación: Better Auth
Contenedorización: Docker
CI/CD: GitHub Actions
Despliegue: Azure Container Apps
Monitoreo: Axiom para logs y trazabilidad en tiempo real
Testing: Tests automatizados con Bun y Hurl

3. ESTRUCTURA DEL PROYECTO 
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

4. EXPLICACIÓN DE CARPETAS 
-> .github/workflows/ = En esta carpeta se almacenan los pipelines de CI/CD que automatizan tareas como ejecutar tests, construir la aplicación y desplegarla. El archivo ci.yml define estos pasos usando GitHub Actions. Aquí suelen usarse dependencias como actions/checkout, setup-node, o scripts de Bun para pruebas.

-> src/ = Es la carpeta principal donde se encuentra todo el código fuente del proyecto. Sigue una estructura basada en Clean Architecture para separar responsabilidades.

-> src/adapter/ = Esta capa contiene todo lo que conecta el sistema con el “mundo exterior”. Aquí viven los controladores de la API, plugins, y las implementaciones concretas de los repositorios. Esta capa usa dependencias como Elysia.js, middlewares, validadores y Drizzle ORM para la base de datos.

-> src/adapter/api/ = Contiene los controladores y las rutas HTTP expuestas por la API. Aquí se definen endpoints, validaciones de entrada y el manejo de las solicitudes del usuario. Su responsabilidad es recibir una petición, llamar al servicio adecuado y devolver la respuesta correspondiente. Usa dependencias de Elysia.js y sus validadores.

-> src/adapter/plugins/ = Contiene plugins globales del servidor como CORS, autenticación, logging y manejo de errores. Aquí también se integran servicios externos como Axiom para monitoreo o Better Auth para autenticación. Se usa cuando se requiere añadir funciones reutilizables a Elysia.

-> src/adapter/repository/ = Aquí se implementan los repositorios que interactúan directamente con la base de datos. Estas implementaciones siguen los contratos definidos en core/repository. Usan Drizzle ORM, adaptadores SQLite y cualquier librería relacionada con persistencia. Esta capa permite cambiar la base de datos sin afectar el dominio.

-> src/core/ = Es el núcleo de la lógica del sistema. Aquí no se importa nada que pertenezca a frameworks externos ni a Elysia. Contiene entidades, reglas de negocio, contratos e interfaces de repositorio.

-> src/core/domain/ = Contiene las entidades del dominio, es decir, las representaciones de los objetos del negocio. Aquí se encuentran los modelos y estructuras que definen qué es un usuario, un recurso, un registro, etc. Esta capa debe mantenerse libre de dependencias externas.

-> src/core/dto/ = Aquí se encuentran los DTO (Data Transfer Objects), que definen la estructura de los datos que se envían o reciben. Sirven para mantener una separación clara entre datos internos del dominio y datos expuestos públicamente. Usan tipos de TypeScript y pueden incluir validaciones.

-> src/core/repository/ = Contiene las interfaces o contratos de los repositorios. Estas definen qué métodos deben ofrecer las implementaciones de persistencia, pero no incluyen detalles de cómo funcionan. Gracias a esto, se puede cambiar de SQLite a otra base sin afectar la lógica del negocio.

-> src/core/service/ = En esta carpeta está la lógica de negocio y los casos de uso del sistema. Aquí se toman decisiones, se aplican reglas y se coordinan operaciones entre entidades y repositorios. Los servicios solo dependen de las interfaces de core/repository y los DTO del dominio, no de frameworks.

->src/index.ts = Es el punto de entrada de la aplicación. Aquí se inicializa Elysia, se cargan los plugins, se registran las rutas y se levanta el servidor. También se pueden iniciar servicios globales como loggers o conexiones.

-> Dockerfile = Define cómo construir la imagen de Docker para ejecutar el proyecto en producción. Contiene instrucciones de instalación, copia del código y ejecución de la aplicación usando Bun.

-> docker-compose.yml = Permite levantar la aplicación en desarrollo, junto con otros servicios necesarios (como la base de datos o herramientas externas). Facilita la orquestación local con Docker

-> .dockerignore =  Lista los archivos que Docker debe ignorar al construir la imagen, para reducir peso y evitar incluir archivos innecesarios.

-> .env / .env.example = .env contiene las variables de entorno reales del proyecto (que no deben subirse al repositorio).
.env.example es una plantilla que muestra qué variables son necesarias para ejecutar la aplicación.

-> package.json = Contiene las dependencias del proyecto, scripts de ejecución y metadatos. Incluye librerías como Elysia, Drizzle ORM, Better Auth, herramientas de test y configuraciones del entorno.

-> tsconfig.json = Archivo de configuración de TypeScript que define reglas de compilación, paths, modo estricto y otras propiedades importantes del lenguaje.

-> README.md = Documento principal de la información del proyecto: descripción, instrucciones de instalación, ejecución, despliegue y arquitectura.

5. CONFIGURACIÓN Y ENTORNO 

La configuración principal esta en .env, estas son las variables típicas del proyecto:


NODE_ENV=production
PORT=3000
MEDIA_PORT=8090


AXIOM_API_TOKEN=xaat-c8b3b6fd-dea8-4b34-88bd-069fb2db453a
AXIOM_DATASET=pds006

BETTER_AUTH_SECRET=T4xhMTvftJ4/x7l6/HRm92iDxzB3MBhN4MkLLwE/xMI=
BETTER_AUTH_URL=http://localhost:3000
DB_FILE_NAME=db.sqlite

La base de datos usada es **SQLite**, almacenada localmente.  
Drizzle ORM gestiona la creación automática de tablas, migraciones y tipado.


6. COMO EJECUTAR EL PROYECTO

1. Clona el repositorio
git clone https://github.com/Nicolas-Archila/pds0006.git

2. Accede al proyecto
cd pds0006

3. Instala dependencias 
bun install 

4. configurar variables de entorno
cp .env.example .env
edita .env con tus valores: 

BETTER_AUTH_SECRET=tu-secret-generado
BETTER_AUTH_URL=http://localhost:3000
DB_FILE_NAME=db.sqlite
AXIOM_TOKEN=tu-axiom-token
AXIOM_DATASET=pds006-logs

5. Levantar el servidor en modo desarrollo 
bun run dev 

7. ENDPOINTS O PETICIONES DISPONIBLES 
Health Check

Método	Ruta	     ¿Qué hace?
GET	/health	    Verifica que la API esté funcionando. Devuelve un mensaje de “OK”.

Devices
Método	Ruta	                 ¿Qué hace?
GET	/api/devices	        Obtiene la lista de todos los dispositivos registrados.
POST	/api/devices	        Crea un nuevo dispositivo en la base de datos.
GET	/api/devices/:id	Obtiene un dispositivo específico usando su ID.
PUT	/api/devices/:id	Actualiza los datos de un dispositivo existente.
DELETE	/api/devices/:id	Elimina un dispositivo por su ID.

Photos
Método	Ruta	                   ¿Qué hace?
GET	/api/photos	   Lista todas las fotos almacenadas.
POST	/api/photos	   Sube una nueva foto al sistema.
GET	/api/photos/:id	   Obtiene una foto específica por su ID.
DELETE	/api/photos/:id	   Elimina una foto del sistema.

Medical Devices
Método	Ruta	                 ¿Qué hace?
GET	/api/medical	        Obtiene todos los dispositivos médicos.
POST	/api/medical	        Registra un nuevo dispositivo médico.
GET	/api/medical/:id 	Obtiene un dispositivo médico específico por ID.
PUT	/api/medical/:id	Actualiza los datos de un dispositivo médico.
DELETE	/api/medical/:id	Elimina un dispositivo médico por su ID.

Computer Requests
Método	Ruta	                ¿Qué hace?
GET	/api/computer	        Obtiene todas las solicitudes de soporte de computadoras.
POST	/api/computer	        Crea una nueva solicitud de soporte técnico.
GET	/api/computer/:id	Obtiene una solicitud específica por ID.
PUT	/api/computer/:id	Actualiza la información de una solicitud.
DELETE	/api/computer/:id	Elimina una solicitud de soporte por ID.

8. ARQUITECTURA DEL PROYECTO 

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
