// Exportar todos los servicios desde un único punto
export { default as api } from './api';
export { default as authService } from './auth.service';
export { default as artworksService } from './artworks.service';
export { default as ordersService } from './orders.service';
export { default as paymentsService } from './payments.service';
export { default as contactService } from './contact.service';
export { default as newsletterService } from './newsletter.service';
export { default as statsService } from './stats.service';
export { default as uploadService } from './upload.service';
export { default as healthService } from './health.service';

// También exportar la configuración de API
export { API_BASE_URL, API_ENDPOINTS } from '../config/api';