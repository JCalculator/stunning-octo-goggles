###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:20-alpine As development
RUN npm i -g pnpm

WORKDIR /app

COPY --chown=node:node pnpm-lock.yaml ./

RUN pnpm fetch --prod

RUN chmod -R 777 /app

COPY --chown=node:node . .

RUN pnpm install

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM cypress/browsers:20 As build
RUN npm i -g pnpm

WORKDIR /app

COPY --chown=node:node pnpm-lock.yaml ./

COPY --chown=node:node --from=development /app/node_modules ./node_modules

COPY --chown=node:node . .

RUN pnpm build

ENV NODE_ENV production

RUN chmod -R 777 /app

RUN pnpm install --prod

USER node

###################
# PRODUCTION
###################

FROM cypress/browsers:20 As production

COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist

CMD [ "node", "dist/main.js" ]