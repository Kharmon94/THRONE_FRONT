# Stage 1: Build
FROM node:22-slim AS build
WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve
FROM node:22-slim
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=build /app/dist ./dist

RUN npm install -g serve@14.2.4

EXPOSE 3000

# No -s (SPA catch-all): unknown paths now return a real 404 (dist/404.html)
# instead of a soft-404 200. All app routes are hash-based (/#admin, /#book/...);
# /appointments (linked from the blog) is rewritten to index.html in dist/serve.json.
CMD ["sh", "-c", "serve dist -l ${PORT:-3000}"]
