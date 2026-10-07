FROM node:20-alpine

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json* ./ 

RUN if [ -f package-lock.json ]; then npm ci; fi

COPY frontend ./frontend

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

