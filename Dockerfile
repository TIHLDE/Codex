FROM node:24-alpine AS base


FROM base AS deps

WORKDIR /build

COPY package.json pnpm-lock.yaml ./

RUN npm i -g pnpm

RUN pnpm i --frozen-lockfile

COPY . .


FROM deps AS builder

ARG SKIP_ENV_VALIDATION=1

# Set using `docker build --build-arg NEXT_PUBLIC_API_URL=<slugs> ...`
ARG NEXT_PUBLIC_ALLOWED_GROUP_SLUGS

RUN pnpm build

RUN pnpm prune --prod


FROM base AS runner

WORKDIR /app

RUN addgroup -S app && adduser -S app -G app

COPY --from=builder --chown=app:app /build/.next ./.next
COPY --from=builder --chown=app:app /build/public ./public
COPY --from=builder --chown=app:app /build/package.json ./package.json
COPY --from=builder --chown=app:app /build/node_modules ./node_modules

USER app

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node_modules/.bin/next", "start"]

