import api from './api';
import { API_ENDPOINTS } from '../config/api';

class UploadService {
  // Subir imagen
  async uploadImage(file, options = {}) {
    try {
      // Validar archivo
      const validationError = this.validateImage(file);
      if (validationError) {
        return {
          success: false,
          error: validationError
        };
      }

      // Comprimir imagen si es necesario
      const processedFile = await this.processImage(file, options);

      // Subir imagen
      const response = await api.upload(API_ENDPOINTS.upload.image, processedFile);
      return response;
    } catch (error) {
      console.error('Error al subir imagen:', error);
      throw error;
    }
  }

  // Eliminar imagen
  async deleteImage(imageId) {
    try {
      const response = await api.delete(API_ENDPOINTS.upload.deleteImage(imageId));
      return response;
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      throw error;
    }
  }

  // Validar imagen
  validateImage(file) {
    // Validar que sea un archivo
    if (!file || !(file instanceof File)) {
      return 'No se ha seleccionado ningún archivo';
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return 'Tipo de archivo no permitido. Solo se permiten imágenes JPG, PNG o WebP';
    }

    // Validar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return 'El archivo es demasiado grande. El tamaño máximo es 10MB';
    }

    return null;
  }

  // Procesar imagen (redimensionar/comprimir si es necesario)
  async processImage(file, options = {}) {
    const {
      maxWidth = 2000,
      maxHeight = 2000,
      quality = 0.9,
      format = 'original'
    } = options;

    // Si no hay que procesar, devolver el archivo original
    if (!options.compress && !options.resize) {
      return file;
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;

          // Calcular nuevas dimensiones si es necesario
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convertir a blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const processedFile = new File(
                  [blob],
                  file.name,
                  { type: blob.type }
                );
                resolve(processedFile);
              } else {
                reject(new Error('Error al procesar la imagen'));
              }
            },
            format === 'original' ? file.type : `image/${format}`,
            quality
          );
        };

        img.onerror = () => reject(new Error('Error al cargar la imagen'));
        img.src = e.target.result;
      };

      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsDataURL(file);
    });
  }

  // Generar URL de preview para una imagen
  generatePreviewUrl(file) {
    if (!file || !(file instanceof File)) {
      return null;
    }
    return URL.createObjectURL(file);
  }

  // Liberar URL de preview
  revokePreviewUrl(url) {
    if (url) {
      URL.revokeObjectURL(url);
    }
  }

  // Obtener dimensiones de una imagen
  async getImageDimensions(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          resolve({
            width: img.width,
            height: img.height
          });
        };

        img.onerror = () => reject(new Error('Error al cargar la imagen'));
        img.src = e.target.result;
      };

      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsDataURL(file);
    });
  }

  // Validar dimensiones mínimas
  async validateDimensions(file, minWidth = 800, minHeight = 600) {
    try {
      const dimensions = await this.getImageDimensions(file);
      
      if (dimensions.width < minWidth || dimensions.height < minHeight) {
        return {
          valid: false,
          error: `La imagen debe tener al menos ${minWidth}x${minHeight} píxeles`
        };
      }

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: 'Error al validar las dimensiones de la imagen'
      };
    }
  }
}

export default new UploadService();