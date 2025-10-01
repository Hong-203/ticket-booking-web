FROM node:20-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 g++ make \
 && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app

RUN useradd -m nestuser

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

RUN mkdir -p /app/uploads && chown -R nestuser:nestuser /app/uploads

USER nestuser

CMD ["node", "dist/main.js"]