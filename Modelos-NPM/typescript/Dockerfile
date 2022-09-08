# --------------> The build image
FROM node:lts@sha256:0c672d547405fe64808ea28b49c5772b1026f81b3b716ff44c10c96abf177d6a as base

WORKDIR /usr/src/app

COPY . .

RUN npm ci && npm run build && npm cache clean --force

# --------------> The production image
FROM node:lts-alpine@sha256:2c405ed42fc0fd6aacbe5730042640450e5ec030bada7617beac88f742b6997b

LABEL version="1.0.0" description="myzap-fit" maintainer="Eduardo Policarpo<eduardopolicarpo@gmail.com>"

ENV NODE_ENV production
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /usr/src/app

COPY --chown=node:node --from=base \
  /usr/src/app/package*.json \
  /usr/src/app/dist ./

RUN apk add --no-cache bash dumb-init chromium && \
  npm ci --only=production && npm cache clean --force

USER node

CMD ["dumb-init", "node", "dist/app.js"]
