# Backend del holograma — despliegue en 5 minutos

Este proxy le pone tu API key de Anthropic en el servidor, para que tu
`holograma-demo.html` funcione abierto localmente (doble clic, `file://`)
sin exponer tu key en el navegador.

## 1. Consigue tu API key
1. Entra a https://console.anthropic.com
2. Ve a **API Keys** → **Create Key**
3. Cópiala (empieza con `sk-ant-...`)

## 2. Sube este proyecto a Vercel

**Opción A — Sin instalar nada (recomendada):**
1. Sube esta carpeta (`holo-backend`) a un repo nuevo de GitHub.
2. Entra a https://vercel.com → **Add New Project** → importa el repo.
3. Antes de darle "Deploy", agrega la variable de entorno:
   - Name: `ANTHROPIC_API_KEY`
   - Value: tu key de arriba
4. Deploy.
5. Vercel te da una URL tipo `https://holo-backend-xxxx.vercel.app`

**Opción B — Con la terminal:**
```bash
npm install -g vercel
cd holo-backend
vercel
# sigue las instrucciones, luego:
vercel env add ANTHROPIC_API_KEY
# pega tu key cuando te la pida
vercel --prod
```

## 3. Conecta tu HTML al backend

Copia la URL que te dio Vercel y agrégale `/api/chat` al final, por ejemplo:
```
https://holo-backend-xxxx.vercel.app/api/chat
```

Abre `holograma-demo.html`, busca esta línea cerca del inicio del `<script>`:
```js
const BACKEND_URL = 'TU-BACKEND-AQUI';
```
y reemplázala por tu URL real:
```js
const BACKEND_URL = 'https://holo-backend-xxxx.vercel.app/api/chat';
```

Guarda el archivo. Ahora sí funciona abierto localmente, sin claude.ai de por medio.

## 4. Prueba

```bash
curl -X POST https://holo-backend-xxxx.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"hola"}]}'
```

Si te regresa un JSON con `content`, ya está listo. Abre el HTML y pruébalo.

## Costo
Vercel: gratis en el plan Hobby para esto.
Anthropic API: pago por uso (revisa precios en console.anthropic.com) —
para una demo de un rato son centavos.
