# tipFund

> cada uno lo suyo, sin líos

PWA para dividir la cuenta del restaurante y gestionar la propina.

## Arrancar en local

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## Build de producción

```bash
npm run build
npm run preview   # previsualizar localmente
```

## Desplegar en Vercel

### Opción A — CLI

```bash
npm i -g vercel
vercel
```

Sigue las instrucciones: framework **Vite**, build command `npm run build`, output dir `dist`.

### Opción B — Dashboard

1. Sube el repo a GitHub
2. En vercel.com → **Add New Project** → importa el repo
3. Vercel detecta Vite automáticamente → **Deploy**

La app se despliega en `https://tipfund.vercel.app` (o el nombre que elijas).

## PWA

- `public/manifest.json` — configuración de instalación
- `public/sw.js` — service worker para caché offline
- Iconos SVG en `public/icons/`

Para probar la instalación abre Chrome/Safari en móvil y pulsa "Añadir a pantalla de inicio".
