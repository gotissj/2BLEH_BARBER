# 2bleh Barber

Sistema de gestión de reservas y citas para barbería, desarrollado con tecnologías modernas y enfocado en la experiencia del usuario.

[![Built with SvelteKit](https://img.shields.io/badge/Built%20with-SvelteKit-FF3E00?style=flat-square&logo=svelte)](https://kit.svelte.dev/)
[![Database: Turso/LibSQL](https://img.shields.io/badge/Database-Turso%2FLibSQL-0066cc?style=flat-square)](https://turso.tech/)
[![ORM: Drizzle](https://img.shields.io/badge/ORM-Drizzle-C5622B?style=flat-square)](https://orm.drizzle.team/)

## Tabla de Contenidos

- [Características](#características)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Desarrollo Local](#desarrollo-local)
- [Configuración de Base de Datos](#configuración-de-base-de-datos)
- [Deploy en Vercel](#deploy-en-vercel)
- [Comandos Disponibles](#comandos-disponibles)
- [Stack Tecnológico](#stack-tecnológico)

## Características

- ✅ Sistema de autenticación seguro (usuario/contraseña)
- ✅ Gestión de citas y reservas en tiempo real
- ✅ Panel administrativo completo
- ✅ Integración con correo (Resend)
- ✅ Notificaciones por WhatsApp (opcional)
- ✅ Restablecimiento de contraseña
- ✅ Responsive design con Tailwind CSS + DaisyUI
- ✅ Persistencia con Turso/LibSQL

## Requisitos

- **Node.js** 18+ o **Bun** (recomendado)
- **Git** para control de versiones
- Cuenta en **[Turso](https://turso.tech/)** (para base de datos remota)
- Variables de entorno configuradas (ver `.env.example`)

## Instalación

### 1. Clonar el repositorio

```bash
git clone <tu-repo-url>
cd 2bleh_web
```

### 2. Instalar dependencias

```bash
bun install
# O con npm: npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales locales.

## Desarrollo Local

### Inicialización de la Base de Datos

```bash
# Empujar el esquema a la base local
bun run db:push

# Crear usuario administrador
bun run seed
```

> **Nota:** El comando `seed` requiere `ADMIN_NAME`, `ADMIN_EMAIL` y `ADMIN_PASSWORD` en `.env`

### Ejecutar el servidor de desarrollo

```bash
bun run dev
# Accede a http://localhost:5173
```

### Scripts disponibles durante desarrollo

```bash
bun run check        # Validar tipos y sintaxis
bun run check:watch  # Validación en tiempo real
bun run lint         # Verificar estilo de código
bun run format       # Formatear código automáticamente
bun run db:studio    # Abrir Drizzle Studio para inspeccionar BD
```

## Configuración de Base de Datos

### Desarrollo (Local)

Para desarrollo local usamos SQLite:

```env
DATABASE_URL=file:local.db
```

Este archivo **nunca debe ser versionado** (está en `.gitignore`).

### Producción (Turso/LibSQL)

Vercel ejecuta funciones serverless sin persistencia de archivos. Usa una base de datos remota:

#### Opción 1: Usar tu base existente

```env
DATABASE_URL=libsql://2bleh-gotissj.aws-us-east-1.turso.io
DATABASE_AUTH_TOKEN=tu_token_aqui
```

#### Opción 2: Crear una nueva base en Turso

1. Ve a [turso.tech](https://turso.tech/)
2. Crea una nueva base de datos
3. Copia las credenciales a `.env`
4. Ejecuta: `bun run db:push`

## Deploy en Vercel

### 1. Preparación local

Verifica que el build funciona:

```bash
bun run build
```

### 2. Configurar Vercel Dashboard

En [vercel.com](https://vercel.com):

1. **New Project** → Importa tu repositorio de GitHub
2. Ve a **Settings → Environment Variables**
3. Agrega las siguientes variables:

| Variable | Valor |
|----------|-------|
| `DATABASE_URL` | `libsql://tu-base.turso.io` |
| `DATABASE_AUTH_TOKEN` | Token de Turso (⚠️ secreto) |
| `RESEND_API_KEY` | API key de Resend (opcional) |
| `EMAIL_FROM` | Email verificado en Resend |
| `ADMIN_NAME` | Nombre del administrador |
| `ADMIN_EMAIL` | Email del administrador |
| `ADMIN_PASSWORD` | Contraseña segura |

> ⚠️ **Importante:** Nunca compartir tokens en código. Vercel encripta automáticamente estas variables.

### 3. Deploy

```bash
git push
# Vercel se dispara automáticamente
```

O deployar manualmente desde el dashboard de Vercel.

### 4. Post-deployment

Si es tu primer deploy en Vercel:

```bash
# Ejecutar migraciones (una sola vez)
bun run db:migrate
```

## Comandos Disponibles

```bash
# Desarrollo
bun run dev          # Servidor de desarrollo
bun run build        # Compilar para producción
bun run preview      # Previsualizar build

# Base de datos
bun run db:push      # Aplicar cambios de esquema
bun run db:generate  # Generar migraciones
bun run db:migrate   # Ejecutar migraciones
bun run db:studio    # Abrir interfaz visual

# Calidad de código
bun run lint         # Verificar ESLint y Prettier
bun run format       # Formatear archivos
bun run check        # Validar tipos TypeScript

# Datos
bun run seed         # Crear usuario admin inicial
```

## Stack Tecnológico

| Tecnología | Propósito | Versión |
|-----------|-----------|---------|
| **SvelteKit** | Framework web | 2.63.0 |
| **Svelte** | Componentes reactivos | 5.56.1 |
| **Vite** | Bundler | 8.0.16 |
| **Tailwind CSS** | Estilos | 4.3.0 |
| **DaisyUI** | Componentes UI | 5.7.19 |
| **Drizzle ORM** | Gestión de BD | 0.45.2 |
| **LibSQL/Turso** | Base de datos | - |
| **Resend** | Email service | 6.22.0 |

## Notas de Seguridad

- ⚠️ **Nunca commitear `.env`** — Git lo ignora automáticamente
- ⚠️ **Proteger tokens** — Usa variables de entorno en Vercel
- ⚠️ **Contraseñas fuertes** — Especialmente para administrador
- ✅ **Auditar dependencias** — Mantener packages actualizados

## Soporte y Contacto

Para reportar problemas o sugerencias, contacta al equipo de desarrollo.

---

**Última actualización:** Agosto 2026

Puedes previsualizar el build de produccion con `bun run preview`.

## Correo de nuevas reservas

Para enviar automáticamente al barbero un correo por cada nueva reserva, configurá estas variables privadas usando [Resend](https://resend.com/):

```env
RESEND_API_KEY=reemplazar_con_tu_api_key
EMAIL_FROM=2bleh Barber <reservas@tu-dominio-verificado.com>
# Solo para pruebas; si se omite, se usa el email del barbero.
EMAIL_TEST_RECIPIENT=
```

Para produccion, elimina `EMAIL_TEST_RECIPIENT` y verifica el dominio usado en `EMAIL_FROM`.

## WhatsApp

Si vas a usar notificaciones por WhatsApp, configura `WHATSAPP_ACCESS_TOKEN`,
`WHATSAPP_PHONE_NUMBER_ID` y, opcionalmente, `WHATSAPP_API_VERSION` como
variables privadas en Vercel.
