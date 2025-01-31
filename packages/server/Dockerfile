FROM node:21.4.0-bookworm-slim
ENV NODE_ENV=production

# install build dependencies
RUN apt update \
  && apt install --assume-yes --no-install-recommends \
  python3

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Build dependencies
RUN corepack enable
WORKDIR /app

# Copy root package.json, pnpm-workspace.yaml, and pnpm-lock.yaml
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
# Copy .tsconfigs/bundler/dom/library-monorepo.json and reproduce correct path
COPY .tsconfigs/bundler/dom/library-monorepo.json /app/.tsconfigs/bundler/dom/library-monorepo.json

# Copy the server package
COPY packages/server ./packages/server

# Install dependencies without dev dependencies and skip prepare scripts
RUN pnpm install --frozen-lockfile

# Set working directory to the server app
WORKDIR /app/packages/server

# Command to start the server
CMD ["pnpm", "start"]
