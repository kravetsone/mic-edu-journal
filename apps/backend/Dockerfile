FROM oven/bun:1.2.16

COPY . /app
WORKDIR /app
RUN bun install

# RUN bunx tsc --noEmit

ENV NODE_ENV=production

ENTRYPOINT [ "bun", "start:backend" ]