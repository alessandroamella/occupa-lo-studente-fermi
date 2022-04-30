FROM node:17.9.0

# Create app directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 5000

ENV IP 0.0.0.0
ENV PORT 5000

CMD [ "npm", "run", "dev" ]