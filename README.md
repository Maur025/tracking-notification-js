# tracking-notification-js

Microservicio para el envío y gestión de notificaciones a través de distintos canales (WhatsApp, Email y SMS).

## Descripción

`tracking-notification-js` se encarga de recibir solicitudes de notificación, procesarlas mediante colas de trabajo y enviarlas a través de los canales configurados. Integra conexión con un gateway externo vía WebSocket, gestión de sesiones de WhatsApp (Baileys) y almacenamiento en base de datos local con Drizzle ORM.

## Requisitos

- Node.js >= 24.0.0
- pnpm >= 12.5.1
- Redis (disponible)
- Dependencia `tracking-common` (incluida en el workspace)

## Instalación

```bash
pnpm install
```

## Configuración

El proyecto utiliza variables de entorno. Crear un archivo `.env` basado en `.env.example`. Las variables mínimas relevantes:

- `APP_PORT` - Puerto del servidor HTTP (por defecto 8801)
- `WS_PORT` - Puerto del servidor WebSocket interno (por defecto 8851)
- `REDIS_HOST`, `REDIS_PORT` - Configuración de Redis
- `WS_GATEWAY_HOST_PROCESSOR`, `WS_GATEWAY_PORT_PROCESSOR` - Gateway externo al que se conecta como cliente
- `DB_URL` - Ruta de la base de datos SQLite (por defecto `./database/tracking-notification.db`)

## Uso

Al iniciar, el microservicio levanta: servidor HTTP/Express, servidor WebSocket interno, cliente WebSocket hacia gateway externo, workers BullMQ para cada canal (email/whatsapp/sms), scheduler y conexiones necesarias a Redis/DB.

```bash
pnpm run dev
```

## Scripts

- `pnpm run dev` - Inicia en modo desarrollo con `--watch`
- `pnpm test` - Ejecuta tests con Vitest
- `pnpm run test:watch` - Ejecuta tests en modo watch
- `pnpm run lint` - Ejecuta ESLint
- `pnpm run generate:migration` - Genera migraciones con Drizzle Kit

## Estructura del proyecto

- `src/channel/` - Gestión de canales de notificación
- `src/email/` - Lógica y worker para notificaciones por correo
- `src/whatsapp/` - Lógica, proveedor (Baileys) y worker para WhatsApp
- `src/sms/` - Lógica y worker para SMS
- `src/server/` - Servidor Express y configuración HTTP
- `src/socket/` - Servidor y cliente WebSocket
- `src/redis/` - Configuración y acceso a Redis
- `src/db/` - Esquemas, migraciones y servicios de base de datos
- `src/common/` - Utilidades, logger, scheduler y helpers
- `src/ioc-container.js` - Configuración de inyección de dependencias (Awilix)

## Estado actual

Ver [docs/ESTADO_ACTUAL.md](docs/ESTADO_ACTUAL.md) para más detalles.

## Licencia

ISC
