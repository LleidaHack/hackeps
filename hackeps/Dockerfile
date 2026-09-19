# Optional self-hosted image. Production is deployed by Vercel from this
# directory; this file exists for local previews and alternative hosting.
#
#   docker build --build-arg REACT_APP_DOMAIN=https://api.example.com \
#                --build-arg REACT_APP_LAUNCH_PENDING=0 -t hackeps .
#   docker run -p 8080:80 hackeps

# Build stage
FROM node:20-alpine AS build

# Every REACT_APP_* value is inlined into the bundle at build time, so each one
# must be promoted from ARG to ENV before `pnpm build` runs.
ARG REACT_APP_DOMAIN
ARG REACT_APP_DEBUG=false
ARG REACT_APP_MAIN=1
ARG REACT_APP_LAUNCH_PENDING=0
ARG REACT_APP_HACKEPS_YEAR=2026
ARG REACT_APP_HERO_ANIMATED=1
ENV REACT_APP_DOMAIN=$REACT_APP_DOMAIN \
    REACT_APP_DEBUG=$REACT_APP_DEBUG \
    REACT_APP_MAIN=$REACT_APP_MAIN \
    REACT_APP_LAUNCH_PENDING=$REACT_APP_LAUNCH_PENDING \
    REACT_APP_HACKEPS_YEAR=$REACT_APP_HACKEPS_YEAR \
    REACT_APP_HERO_ANIMATED=$REACT_APP_HERO_ANIMATED

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.7.0 --activate

# Build the checked-out sources (not a fresh clone), with the pinned lockfile.
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Production stage
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
