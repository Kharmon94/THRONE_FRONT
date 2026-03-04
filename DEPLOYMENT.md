# Railway Deployment

## Required: VITE_API_URL

The frontend must know the backend API URL at **build time**. Set `VITE_API_URL` in your Railway service variables to your backend's public URL.

Example: `https://throne-back-production-xxxx.up.railway.app`

Railway injects this during the build, and Vite bakes it into the bundle.

## Deployment Order

1. Deploy the **backend** (THRONE_BACK) first. Get its public URL.
2. In the **frontend** service (THRONE_FRONT), add variable:
   - `VITE_API_URL` = backend URL (no trailing slash)
3. Deploy the frontend.
4. In the **backend** service, add variable:
   - `FRONTEND_ORIGIN` = frontend URL (e.g. `https://your-frontend.up.railway.app`) for CORS
5. Redeploy the backend.

## Local Development

Use `.env` with `VITE_API_URL=http://localhost:3000` (or your local API URL).
