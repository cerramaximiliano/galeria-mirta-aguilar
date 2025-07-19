# Guía de Despliegue - Galería Mirta Aguilar

## 1. Instalación en AWS EC2 Ubuntu

### Prerrequisitos
- Ubuntu Server con Node.js, npm y PM2 instalados
- Acceso SSH al servidor
- Git instalado en el servidor

### Pasos de instalación

1. **Conectarse al servidor**
```bash
ssh -i tu-llave.pem ubuntu@tu-servidor-ip
```

2. **Clonar el repositorio**
```bash
cd /var/www
sudo git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git galeria-mirta-aguilar
cd galeria-mirta-aguilar
sudo chown -R ubuntu:ubuntu .
```

3. **Instalar dependencias**
```bash
npm install
```

4. **Crear archivo de variables de entorno**
```bash
cp .env.example .env
nano .env
```

Configura las siguientes variables:
```env
VITE_API_URL=http://tu-backend-api.com
VITE_UPLOAD_URL=http://tu-backend-api.com/api/upload
VITE_SITE_URL=https://tu-dominio.com
```

5. **Construir la aplicación**
```bash
npm run build
```

6. **Crear directorio de logs**
```bash
mkdir logs
```

7. **Iniciar con PM2**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 2. Configuración del Dominio

### Configurar registros DNS
En tu proveedor de dominio (GoDaddy, Namecheap, etc.), configura:

1. **Registro A**
   - Tipo: A
   - Host: @ (o vacío)
   - Valor: IP-DE-TU-SERVIDOR
   - TTL: 3600

2. **Registro CNAME para www** (opcional)
   - Tipo: CNAME
   - Host: www
   - Valor: tu-dominio.com
   - TTL: 3600

Espera 5-10 minutos para la propagación DNS.

## 3. Instalación y Configuración de Nginx

### Instalar Nginx
```bash
sudo apt update
sudo apt install nginx -y
```

### Crear configuración del sitio
```bash
sudo nano /etc/nginx/sites-available/galeria-mirta-aguilar
```

Contenido del archivo:
```nginx
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;
    
    # Redirigir todo el tráfico HTTP a HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tu-dominio.com www.tu-dominio.com;
    
    # Los certificados SSL se agregarán con Certbot
    # ssl_certificate /etc/letsencrypt/live/tu-dominio.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/tu-dominio.com/privkey.pem;
    
    # Configuración de seguridad SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Configuración de logs
    access_log /var/log/nginx/galeria-mirta-aguilar.access.log;
    error_log /var/log/nginx/galeria-mirta-aguilar.error.log;
    
    # Tamaño máximo de upload (para imágenes)
    client_max_body_size 10M;
    
    # Proxy hacia la aplicación
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Configuración para archivos estáticos (opcional)
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|pdf|svg|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Activar el sitio
```bash
sudo ln -s /etc/nginx/sites-available/galeria-mirta-aguilar /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 4. Certificado SSL con Let's Encrypt

### Instalar Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### Obtener certificado SSL
```bash
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
```

Sigue las instrucciones:
1. Ingresa tu email
2. Acepta los términos
3. Decide si compartir tu email
4. Elige la opción 2 para redirigir HTTP a HTTPS

### Renovación automática
Certbot configura la renovación automática. Puedes verificarlo con:
```bash
sudo systemctl status certbot.timer
```

Para probar la renovación:
```bash
sudo certbot renew --dry-run
```

## 5. Comandos útiles

### PM2
```bash
# Ver estado de la aplicación
pm2 status

# Ver logs
pm2 logs galeria-mirta-aguilar

# Reiniciar aplicación
pm2 restart galeria-mirta-aguilar

# Detener aplicación
pm2 stop galeria-mirta-aguilar
```

### Nginx
```bash
# Verificar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx

# Ver logs de Nginx
sudo tail -f /var/log/nginx/galeria-mirta-aguilar.error.log
```

### Actualizar la aplicación
```bash
cd /var/www/galeria-mirta-aguilar
git pull origin main
npm install
npm run build
pm2 restart galeria-mirta-aguilar
```

## 6. Solución de problemas

### Si el sitio no carga:
1. Verifica que PM2 esté ejecutando la aplicación: `pm2 status`
2. Revisa los logs de PM2: `pm2 logs`
3. Verifica que Nginx esté activo: `sudo systemctl status nginx`
4. Revisa los logs de Nginx: `sudo tail -f /var/log/nginx/galeria-mirta-aguilar.error.log`

### Si hay problemas con el certificado SSL:
1. Verifica que el dominio apunte correctamente a tu servidor
2. Asegúrate que los puertos 80 y 443 estén abiertos en el security group de AWS
3. Revisa los logs de Certbot: `sudo journalctl -u certbot`

### Permisos
Si hay problemas de permisos:
```bash
sudo chown -R ubuntu:ubuntu /var/www/galeria-mirta-aguilar
```