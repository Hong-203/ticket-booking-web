FROM node:18-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++ libc6-compat

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/package*.json ./

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/dist ./dist

USER appuser

EXPOSE 3000

CMD ["node", "dist/main.js"]
