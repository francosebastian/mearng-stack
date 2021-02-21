############################################################
# Dockerfile para configurar aplicación en node.js - Express
############################################################

# Establece la imagen base
FROM node

# Información de Metadata
LABEL "cl.francosebastian.appNode"="Franco Sebastian"
LABEL maintainer="francosebastian22@gmail.com"
LABEL version="1.0"


# Crear directorio de trabajo
RUN mkdir -p /opt/app

# Se estable el directorio de trabajo
WORKDIR /opt/app

# Instala los paquetes existentes en el package.json
COPY package*.json ./
RUN npm install --quiet

# Copia la Aplicación
COPY . .

# Expone la aplicación en el puerto 5000
EXPOSE 5000

# Inicia la aplicación al iniciar al contenedor
CMD ["node", "index.js"]
