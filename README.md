# 2bleh Barber

Aplicacion de reservas para 2bleh Barber, construida con SvelteKit, Drizzle y LibSQL.

## Desarrollo local

Instala las dependencias y copia `.env.example` a `.env`. Para desarrollo local,
`DATABASE_URL=file:local.db` crea la base SQLite en la maquina y nunca debe
subirse al repositorio.

```sh
bun install
Copy-Item .env.example .env
bun run db:push
bun run seed
bun run dev
```

El comando `seed` requiere definir `ADMIN_NAME`, `ADMIN_EMAIL` y
`ADMIN_PASSWORD` en `.env`.

## Base de datos en produccion

Vercel usa funciones serverless y no conserva archivos escritos en el servidor.
No uses `file:local.db` en produccion. Crea una base LibSQL/Turso remota y
configura su URL y token como variables privadas:

```env
DATABASE_URL=libsql://tu-base.turso.io
DATABASE_AUTH_TOKEN=tu_token
```

Con esas variables disponibles localmente, aplica el esquema versionado antes
del primer despliegue:

```sh
bun run db:migrate
```

La carpeta `drizzle/` contiene las migraciones y debe versionarse en Git. No
subas `.env`, `local.db` ni ningun token. En Vercel, agrega `DATABASE_URL`,
`DATABASE_AUTH_TOKEN`, `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` y las
variables opcionales de correo/WhatsApp en **Project Settings > Environment
Variables**. Despues de cargarlas, vuelve a desplegar la aplicacion.

## Build

```sh
bun run build
```

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
