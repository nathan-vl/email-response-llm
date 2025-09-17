FROM oven/bun:1 AS base
WORKDIR /app

COPY bun.lock package.json ./
RUN bun install --frozen-lockfile --production

RUN rm -rf app
COPY . .

ENV NODE_ENV=production
RUN bun run build

FROM nginx:1.29-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=base /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
