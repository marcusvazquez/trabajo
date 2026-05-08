## Ojo de Lince

Sistema de control de acceso para CECYTE BC Villa del Sol.

### Variables de entorno

Crea un archivo `.env.local` con base en `.env.example`:

```bash
cp .env.example .env.local
```

Llena al menos:

- `EMAIL_USER`
- `EMAIL_PASS`
- `MONGODB_URI`
- `MONGODB_DB_NAME`

### Probar conexion MongoDB

Con el proyecto corriendo (`npm run dev`), visita:

- [http://localhost:3000/api/db-test](http://localhost:3000/api/db-test)

Si todo esta bien, responde:

```json
{ "ok": true, "message": "Conexion exitosa con MongoDB" }
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
