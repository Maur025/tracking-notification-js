# Deuda técnica

| ID | Ubicación | Descripción | Tipo | Impacto | Importancia/Prioridad | Sugerencia |
|---|---|---|---|---|---|---|
| DT-001 | src/sms/sms-worker.service.js:5 | Servicio SMS solo hace `console.log`, sin implementación de envío. | Funcional | Alto | P0 | Implementar lógica de envío delegando a un notifier/provider para SMS. |
| DT-002 | src/email/email-worker.service.js:13-16 | Validación mínima de datos de email (message, subject, toList). | Robustez | Medio | P1 | Fortalecer validación con tipos/Zod y manejo de errores más explícito. |
| DT-003 | src/whatsapp/whatsapp-worker.service.js:11-14 | Validación mínima de datos de WhatsApp (to, channelId). | Robustez | Medio | P1 | Agregar validación más completa y mensajes de error estructurados. |
| DT-004 | Tests | Cobertura de tests limitada o insuficiente. | Testing | Medio | P2 | Agregar tests unitarios para workers/notifiers y casos críticos. |
| DT-005 | src/index.js | Hay código de setup/output con `console.error/log` y estructura con comentarios; puede mejorarse claridad. | Mantenibilidad | Bajo | P2 | Migrar logs a logger centralizado y limpiar código no utilizado. |
| DT-006 | SMS (general) | Módulos SMS completos existen pero sin funcionalidad operativa. | Integración | Medio | P1 | Completar implementación SMS o marcar claramente como no funcional en docs hasta estar listo. |
| DT-007 | Manejo de errores | Uso mixto de `console.*` vs `logger` en varios puntos. | Estándar | Bajo | P3 | Unificar logging usando `common/logger.js`. |
| DT-008 | Configuración | `.env.example` completo pero algunas configuraciones podrían tener defaults más explícitos/documentados. | Configuración | Bajo | P3 | Revisar defaults críticos y documentar mínimos en README. |
| DT-009 | Dependencia local | Usa `tracking-common` desde `file:../tracking-common`. | Dependencias | Bajo | P3 | Asegurar consistencia de versión/ubicación en entornos distintos. |
| DT-010 | Seguridad | CORS abierto (`origin: "*"`) en server-app. | Seguridad | Medio | P1 | Restringir orígenes según entorno (dev/prod). |
| DT-011 | Validación HTTP | Validación en controllers limitada. | Seguridad/Robustez | Medio | P1 | Añadir esquemas de validación (Zod) en endpoints expuestos. |
| DT-012 | WhatsApp (Baileys) | Gestión de sesiones/reconexión requiere cuidado (QR, auth). | Operación | Medio | P1 | Documentar requisitos operativos y estados de reconexión. |
