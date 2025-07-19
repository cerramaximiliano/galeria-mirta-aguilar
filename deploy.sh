#!/bin/bash

# Script de despliegue para Galería Mirta Aguilar
# Uso: ./deploy.sh

echo "🎨 Iniciando despliegue de Galería Mirta Aguilar..."

# Obtener últimos cambios
echo "📥 Obteniendo últimos cambios del repositorio..."
git pull origin main

# Instalar dependencias si hay cambios en package.json
echo "📦 Verificando dependencias..."
npm install

# Construir la aplicación
echo "🔨 Construyendo la aplicación..."
npm run build

# Reiniciar PM2
echo "🔄 Reiniciando aplicación con PM2..."
pm2 restart galeria-mirta-aguilar

echo "✅ Despliegue completado exitosamente!"
echo "📊 Estado de la aplicación:"
pm2 status galeria-mirta-aguilar