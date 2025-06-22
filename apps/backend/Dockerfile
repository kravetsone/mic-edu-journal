FROM oven/bun:1.2.16

COPY . /app
WORKDIR /app
RUN bun install

# RUN bunx tsc --noEmit

ENV NODE_ENV=production

RUN bunx drizzle-kit migrate

WORKDIR /app/apps/backend

ENTRYPOINT [ "bun", "start" ]