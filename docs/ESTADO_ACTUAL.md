# Estado actual

## Madurez

**Experimental** - Proyecto en fase de desarrollo activo. Estructura definida y flujos básicos implementados, pero aún sujeto a cambios.

## ¿Qué funciona?

- **Conexión con gateway externo**: Cliente WebSocket que se conecta al processor gateway para recibir/sincronizar datos.
- **Workers por canal**: Workers BullMQ para procesar colas de notificación de Email, WhatsApp y SMS.
- **Proveedor WhatsApp (Baileys)**: Integración con Baileys para envío y gestión de sesiones de WhatsApp.
- **Servidor HTTP**: API REST con Express, incluyendo endpoints para gestión de canales.
- **Servidor WebSocket interno**: Para comunicación interna.
- **Base de datos**: Configuración con Drizzle ORM + SQLite/Turso (libSQL).
- **Inyección de dependencias**: Contenedor IoC con Awilix.
- **Scheduler**: Tareas programadas básicas.

## ¿Qué no funciona?

- **SMS**: Estructura presente (worker, queue, controller, service), pero aún sin implementación completa del envío.
- **Cobertura de tests**: Tests mínimos presentes; cobertura limitada.
- **Validación exhaustiva**: Algunas rutas/acciones pueden carecer de validación completa.

## Limitaciones conocidas

- Depende de Redis para colas BullMQ y coordinación.
- Requiere conexión activa al gateway WebSocket externo para ciertos flujos.
- WhatsApp utiliza instancia Baileys (puede requerir QR/reconexión).
- Almacenamiento principal en SQLite (adecuado para desarrollo; evaluar producción).
- Depende del paquete local `tracking-common`.
