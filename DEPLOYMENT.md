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
4. In the **backend** service, add variables:
   - `FRONTEND_ORIGIN` = frontend URL (e.g. `https://your-frontend.up.railway.app`) for CORS
   - `API_HOST` = backend hostname (e.g. `throne-back-production-xxxx.up.railway.app`)
   - `RAILS_HOSTS` = same backend hostname
   - `SECRET_KEY_BASE` / `ADMIN_SEED_PASSWORD`
   - `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_BUCKET` for durable project images
5. Redeploy the backend.

Without the AWS variables, Active Storage uses local disk on the API container — uploads disappear on redeploy.

## Local Development

Use `.env` with `VITE_API_URL=http://localhost:3000` (or your local API URL).
