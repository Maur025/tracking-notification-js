FROM node:22.23.0-alpine AS common-prepare

WORKDIR /tracking-common

COPY tracking-common/ .

RUN npm install

FROM node:24.16.0-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /tracking-common

COPY --from=common-prepare /tracking-common .

WORKDIR /app

COPY tracking-notification-js/package.json tracking-notification-js/pnpm-lock.yaml tracking-notification-js/pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile
COPY tracking-notification-js/ .

FROM node:24.16.0-alpine AS runner

WORKDIR /app

COPY --from=base /app/package.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/src ./src
COPY --from=base /app/drizzle ./drizzle

EXPOSE 8801

ENV NODE_ENV=production

CMD ["node", "src/index.js"]