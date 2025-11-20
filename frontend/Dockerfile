# 1. Use a specific, recent version of Alpine (more stable than 'latest')
FROM node:20-alpine3.19

# 2. CRITICAL FIX: Upgrade OS packages to patch known High Vulnerabilities
RUN apk update && apk upgrade --no-cache

# 3. Update NPM itself to the latest version to fix package manager CVEs
RUN npm install -g npm@latest

WORKDIR /app

# 4. Install Dependencies
COPY package*.json ./
RUN npm install

# 5. Copy Source Code
COPY . .

# 6. Run the App
CMD ["npm", "run", "dev", "--", "--host"]