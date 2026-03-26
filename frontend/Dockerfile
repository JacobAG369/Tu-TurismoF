# Etapa de construcción
FROM node:20-alpine as build-stage

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Construir el proyecto para producción
RUN npm run build

# Etapa de producción (servir con Nginx)
FROM nginx:alpine as production-stage

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los estáticos generados a la carpeta de Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
