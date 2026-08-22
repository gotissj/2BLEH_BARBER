# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
bun x sv@0.17.0 create --template minimal --types jsdoc --add prettier eslint tailwindcss="plugins:typography,forms" drizzle="database:sqlite+sqlite:libsql" --install bun 2bleh_web
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Correo de nuevas reservas

Para enviar automáticamente al barbero un correo por cada nueva reserva, configurá estas variables privadas usando [Resend](https://resend.com/):

```env
RESEND_API_KEY=reemplazar_con_tu_api_key
EMAIL_FROM=2bleh Barber <reservas@tu-dominio-verificado.com>
# Solo para pruebas; si se omite, se usa el email del barbero.
EMAIL_TEST_RECIPIENT=tngatiago@gmail.com
```

Para producción, eliminá `EMAIL_TEST_RECIPIENT` y verificá el dominio usado en `EMAIL_FROM`.
