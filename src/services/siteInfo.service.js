import api from './api';
import { API_ENDPOINTS } from '../config/api';
import { siteInfoData } from '../data/siteInfo';

class SiteInfoService {
  constructor() {
    this.useMockData = false; // Backend está listo con las rutas proporcionadas
    console.log('🏢 SiteInfoService inicializado');
    console.log(`📡 Modo: ${this.useMockData ? 'DATOS LOCALES (JSON)' : 'API BACKEND'}`);
  }

  // BIOGRAFÍA
  async getBiography() {
    if (this.useMockData) {
      console.log('📂 Usando datos locales para biografía');
      return {
        success: true,
        data: siteInfoData.biography
      };
    }

    try {
      console.log('🌐 Obteniendo biografía desde API...');
      const response = await api.get(API_ENDPOINTS.siteinfo.getBiography);
      console.log('✅ Biografía obtenida de la API');
      return response;
    } catch (error) {
      console.error('❌ Error al obtener biografía:', error);
      // Fallback a datos locales en caso de error
      console.log('📂 Usando datos locales como fallback');
      return {
        success: true,
        data: siteInfoData.biography
      };
    }
  }

  async updateBiography(biographyData) {
    if (this.useMockData) {
      console.log('📂 Simulando actualización de biografía...');
      // Simular actualización
      Object.assign(siteInfoData.biography, biographyData);
      siteInfoData.metadata.lastUpdated = new Date().toISOString();
      
      return {
        success: true,
        message: 'Biografía actualizada exitosamente',
        data: siteInfoData.biography
      };
    }

    try {
      console.log('🌐 Actualizando biografía en API...');
      const updateData = {
        biography: biographyData
      };
      const response = await api.put(API_ENDPOINTS.siteinfo.update, updateData);
      console.log('✅ Biografía actualizada en la API');
      return response;
    } catch (error) {
      console.error('❌ Error al actualizar biografía:', error);
      throw error;
    }
  }

  async uploadProfileImage(imageFile) {
    if (this.useMockData) {
      console.log('📂 Simulando subida de imagen de perfil...');
      // Simular subida de imagen
      return {
        success: true,
        data: {
          url: URL.createObjectURL(imageFile),
          alt: 'Foto de perfil'
        }
      };
    }

    try {
      console.log('🌐 Subiendo imagen de perfil a API...');
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await api.post(API_ENDPOINTS.upload.image, formData);
      console.log('✅ Imagen de perfil subida exitosamente');
      return response;
    } catch (error) {
      console.error('❌ Error al subir imagen:', error);
      throw error;
    }
  }

  // INFORMACIÓN DE CONTACTO
  async getContactInfo() {
    if (this.useMockData) {
      console.log('📂 Usando datos locales para información de contacto');
      return {
        success: true,
        data: siteInfoData.contact
      };
    }

    try {
      console.log('🌐 Obteniendo información de contacto desde API...');
      const response = await api.get(API_ENDPOINTS.siteinfo.getContact);
      console.log('✅ Información de contacto obtenida de la API');
      return response;
    } catch (error) {
      console.error('❌ Error al obtener información de contacto:', error);
      // Fallback a datos locales en caso de error
      console.log('📂 Usando datos locales como fallback');
      return {
        success: true,
        data: siteInfoData.contact
      };
    }
  }

  async updateContactInfo(contactData) {
    if (this.useMockData) {
      console.log('📂 Simulando actualización de información de contacto...');
      // Simular actualización
      Object.assign(siteInfoData.contact, contactData);
      siteInfoData.metadata.lastUpdated = new Date().toISOString();
      
      return {
        success: true,
        message: 'Información de contacto actualizada',
        data: siteInfoData.contact
      };
    }

    try {
      console.log('🌐 Actualizando información de contacto en API...');
      const updateData = {
        contact: contactData
      };
      const response = await api.put(API_ENDPOINTS.siteinfo.update, updateData);
      console.log('✅ Información de contacto actualizada en la API');
      return response;
    } catch (error) {
      console.error('❌ Error al actualizar información de contacto:', error);
      throw error;
    }
  }

  async updateSocialMedia(socialData) {
    if (this.useMockData) {
      console.log('📂 Simulando actualización de redes sociales...');
      // Simular actualización
      Object.assign(siteInfoData.contact.socialMedia, socialData);
      siteInfoData.metadata.lastUpdated = new Date().toISOString();
      
      return {
        success: true,
        message: 'Redes sociales actualizadas',
        data: siteInfoData.contact.socialMedia
      };
    }

    try {
      console.log('🌐 Actualizando redes sociales en API...');
      const updateData = {
        contact: {
          ...siteInfoData.contact,
          socialMedia: socialData
        }
      };
      const response = await api.put(API_ENDPOINTS.siteinfo.update, updateData);
      console.log('✅ Redes sociales actualizadas en la API');
      return response;
    } catch (error) {
      console.error('❌ Error al actualizar redes sociales:', error);
      throw error;
    }
  }

  async updateBusinessHours(hoursData) {
    if (this.useMockData) {
      console.log('📂 Simulando actualización de horarios...');
      // Simular actualización
      Object.assign(siteInfoData.contact.businessHours, hoursData);
      siteInfoData.metadata.lastUpdated = new Date().toISOString();
      
      return {
        success: true,
        message: 'Horarios actualizados',
        data: siteInfoData.contact.businessHours
      };
    }

    try {
      console.log('🌐 Actualizando horarios en API...');
      const updateData = {
        contact: {
          ...siteInfoData.contact,
          businessHours: hoursData
        }
      };
      const response = await api.put(API_ENDPOINTS.siteinfo.update, updateData);
      console.log('✅ Horarios actualizados en la API');
      return response;
    } catch (error) {
      console.error('❌ Error al actualizar horarios:', error);
      throw error;
    }
  }

  // PÁGINAS LEGALES
  async getPrivacyPolicy() {
    try {
      console.log('🌐 Obteniendo política de privacidad desde API...');
      const response = await api.get(API_ENDPOINTS.siteinfo.getPrivacyPolicy);
      console.log('✅ Política de privacidad obtenida de la API');
      return response;
    } catch (error) {
      console.error('❌ Error al obtener política de privacidad:', error);
      return {
        success: true,
        data: {
          title: 'Política de Privacidad',
          content: '',
          lastUpdated: new Date()
        }
      };
    }
  }

  async getTermsAndConditions() {
    try {
      console.log('🌐 Obteniendo términos y condiciones desde API...');
      const response = await api.get(API_ENDPOINTS.siteinfo.getTermsAndConditions);
      console.log('✅ Términos y condiciones obtenidos de la API');
      return response;
    } catch (error) {
      console.error('❌ Error al obtener términos y condiciones:', error);
      return {
        success: true,
        data: {
          title: 'Términos y Condiciones',
          content: '',
          lastUpdated: new Date()
        }
      };
    }
  }

  async getLegalPages() {
    try {
      console.log('🌐 Obteniendo páginas legales desde API...');
      const response = await api.get(API_ENDPOINTS.siteinfo.getLegalPages);
      console.log('✅ Páginas legales obtenidas de la API');
      return response;
    } catch (error) {
      console.error('❌ Error al obtener páginas legales:', error);
      return {
        success: true,
        data: {}
      };
    }
  }

  async updatePrivacyPolicy(data) {
    try {
      console.log('🌐 Actualizando política de privacidad en API...');
      const response = await api.put(API_ENDPOINTS.siteinfo.updatePrivacyPolicy, data);
      console.log('✅ Política de privacidad actualizada en la API');
      return response;
    } catch (error) {
      console.error('❌ Error al actualizar política de privacidad:', error);
      throw error;
    }
  }

  async updateTermsAndConditions(data) {
    try {
      console.log('🌐 Actualizando términos y condiciones en API...');
      const response = await api.put(API_ENDPOINTS.siteinfo.updateTermsAndConditions, data);
      console.log('✅ Términos y condiciones actualizados en la API');
      return response;
    } catch (error) {
      console.error('❌ Error al actualizar términos y condiciones:', error);
      throw error;
    }
  }

  // OBTENER TODA LA INFORMACIÓN
  async getAllSiteInfo() {
    if (this.useMockData) {
      console.log('📂 Usando datos locales para toda la información del sitio');
      return {
        success: true,
        data: siteInfoData
      };
    }

    try {
      console.log('🌐 Obteniendo toda la información del sitio desde API...');
      const response = await api.get(API_ENDPOINTS.siteinfo.getAll);
      console.log('✅ Información del sitio obtenida de la API');
      return response;
    } catch (error) {
      console.error('❌ Error al obtener información del sitio:', error);
      // Fallback: intentar obtener por separado
      console.log('🔄 Intentando obtener información por separado...');
      try {
        const [biographyRes, contactRes] = await Promise.all([
          this.getBiography(),
          this.getContactInfo()
        ]);

        return {
          success: true,
          data: {
            biography: biographyRes.data,
            contact: contactRes.data,
            metadata: siteInfoData.metadata
          }
        };
      } catch (fallbackError) {
        console.error('❌ Error en fallback:', fallbackError);
        // Último recurso: datos locales
        console.log('📂 Usando datos locales como último recurso');
        return {
          success: true,
          data: siteInfoData
        };
      }
    }
  }
}

export default new SiteInfoService();