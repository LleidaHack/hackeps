# HackEPS Frontend

Frontend de HackEPS (React + CRA + Tailwind) usando `pnpm`.

## Estructura del repositorio

Este repo contiene el proyecto en:

- `/Users/bepeslabs/Documents/GitHub_Repositoris/hackeps/hackeps`

Desde la raíz del repo:

```bash
cd /Users/bepeslabs/Documents/GitHub_Repositoris/hackeps/hackeps
```

## Requisitos

- Node.js 18+ (recomendado 20 LTS)
- pnpm 10.x

Comprobar versiones:

```bash
node -v
pnpm -v
```

## Instalación

```bash
pnpm install
```

## Variables de entorno

1. Copia el archivo de ejemplo:

```bash
cp .env.sample .env
```

2. Edita `.env` con tus valores:

```env
PORT=3000
REACT_APP_DOMAIN="https://tu-backend.com"
REACT_APP_API_KEY=""
REACT_APP_DEBUG=0
REACT_APP_MAIN=1
REACT_APP_HERO_ANIMATED=1
```

Notas:
- `REACT_APP_DOMAIN` es la URL del backend.
- Variables `REACT_APP_*` son públicas en frontend (no poner secretos reales).

## Ejecutar en local (desarrollo)

```bash
pnpm start
```

Abre:

- [http://localhost:3000](http://localhost:3000)

## Build de producción

```bash
pnpm build
```

Genera la carpeta `build/`.

El script usa `CI=false` para que los warnings de lint no rompan la build en CI/CD.

## Tests

Actualmente no hay suite de tests activa en el proyecto.

## Formateo

```bash
pnpm format
```

## Ejecutar con Docker

Desde la carpeta del proyecto (`hackeps/`):

```bash
docker build -t hackeps-frontend .
docker run --rm -p 3000:80 hackeps-frontend
```

## Despliegue en Vercel

Configuración recomendada:

- Install Command: `pnpm install`
- Build Command: `pnpm run build`
- Output Directory: `build`

Asegúrate de configurar en Vercel las mismas variables de entorno que usas en `.env`.

## Scripts disponibles

```bash
pnpm start      # desarrollo
pnpm build      # build producción
pnpm format     # prettier
pnpm eject      # CRA eject (irreversible)
```
