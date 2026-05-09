## Ojo de Lince

Sistema de control de acceso para CECYTE BC Villa del Sol.

### Variables de entorno (local)

Crea un archivo `.env.local` con base en `.env.example` y completa los valores:

```bash
cp .env.example .env.local
```

Variables clave para iniciar sesión en prefectura:

- `PREFECTURE_LOGIN_EMAIL`
- `PREFECTURE_LOGIN_PASSWORD`

Variables clave para Supabase:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Variables de WhatsApp (si se usan alertas por WhatsApp):

- `WHATSAPP_PHONE`
- `WHATSAPP_APIKEY`

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

`.env.local` **no se sube a GitHub** y **Vercel no lo lee automáticamente**.
Debes configurar las variables en el panel de Vercel:

1. Entra a tu proyecto en Vercel.
2. Ve a **Settings → Environment Variables**.
3. Agrega (mínimo):
   - `PREFECTURE_LOGIN_EMAIL`
   - `PREFECTURE_LOGIN_PASSWORD`
4. (Recomendado también):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `WHATSAPP_PHONE`
   - `WHATSAPP_APIKEY`
5. Guarda y haz **Redeploy**.

Si no defines `PREFECTURE_LOGIN_EMAIL` y `PREFECTURE_LOGIN_PASSWORD`, aparecerá el mensaje:
`Credenciales de prefectura no configuradas...`.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
