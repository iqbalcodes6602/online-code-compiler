FROM node:18-bullseye

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN apt-get update && \
    apt-get install -y \
        python3 \
        python3-pip \
        g++ \
        default-jdk


EXPOSE 5000

CMD ["node", "index.js"]
