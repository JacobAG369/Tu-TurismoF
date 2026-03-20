import { useEffect, useRef, useState } from 'react';
import { useToast } from './useToast';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

/**
 * Hook para manejar validación, previsualización y cleanup de imágenes
 * @returns {{
 *   validateAndSetFile: (file: File) => boolean,
 *   previewUrl: string | null,
 *   clearPreview: () => void,
 *   isValidFormat: (mimeType: string) => boolean
 * }}
 */
export function useImageUpload() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const previewUrlRef = useRef(null);
  const { toast } = useToast();

  /**
   * Valida el formato MIME de la imagen
   */
  const isValidFormat = (mimeType) => {
    return ACCEPTED_FORMATS.includes(mimeType);
  };

  /**
   * Valida el tamaño del archivo
   */
  const isValidSize = (file) => {
    return file.size <= MAX_FILE_SIZE;
  };

  /**
   * Valida la extensión del archivo
   */
  const hasValidExtension = (filename) => {
    const lowerName = filename.toLowerCase();
    return ACCEPTED_EXTENSIONS.some(ext => lowerName.endsWith(ext));
  };

  /**
   * Valida y establece el archivo, creando una previsualización
   * Retorna true si es válido, false si hay error
   */
  const validateAndSetFile = (file) => {
    // Validar que sea archivo
    if (!file || !(file instanceof File)) {
      toast({
        title: 'Error',
        description: 'Selecciona una imagen válida.',
        variant: 'destructive',
      });
      return false;
    }

    // Validar extensión
    if (!hasValidExtension(file.name)) {
      toast({
        title: 'Formato no válido',
        description: 'La imagen debe ser JPG, PNG o WebP.',
        variant: 'destructive',
      });
      return false;
    }

    // Validar MIME type
    if (!isValidFormat(file.type)) {
      toast({
        title: 'Tipo de archivo no permitido',
        description: `El archivo "${file.name}" no es una imagen válida (JPEG, PNG o WebP).`,
        variant: 'destructive',
      });
      return false;
    }

    // Validar tamaño
    if (!isValidSize(file)) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      toast({
        title: 'Archivo demasiado grande',
        description: `El archivo pesa ${sizeMB}MB. El máximo es 2MB.`,
        variant: 'destructive',
      });
      return false;
    }

    // Crear previsualización
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    previewUrlRef.current = URL.createObjectURL(file);
    setPreviewUrl(previewUrlRef.current);

    return true;
  };

  /**
   * Limpia la previsualización
   */
  const clearPreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewUrl(null);
  };

  /**
   * Cleanup cuando el componente se desmonta
   */
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  return {
    validateAndSetFile,
    previewUrl,
    clearPreview,
    isValidFormat,
    MAX_FILE_SIZE,
    ACCEPTED_FORMATS,
  };
}
