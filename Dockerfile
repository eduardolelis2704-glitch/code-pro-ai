FROM node:22-alpine
WORKDIR /app
COPY package.json ./
COPY server.js ./
COPY public ./public
ENV NODE_ENV=production PORT=3100
EXPOSE 3100
USER node
CMD ["node","server.js"]
