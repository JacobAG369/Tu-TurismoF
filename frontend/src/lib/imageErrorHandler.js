/**
 * Extrae y formatea errores de validación 422 del backend
 * @param {Error} error - Error de Axios con response.data
 * @returns {{
 *   fieldErrors: Record<string, string[]>,
 *   message: string,
 *   hasImageError: boolean
 * }}
 */
export function parseImageUploadError(error) {
  const response = error?.response?.data;

  // Estructura esperada del backend:
  // {
  //   status: 422,
  //   message: "...",
  //   errors: {
  //     imagen: ["El archivo excede..."]
  //   }
  // }

  const fieldErrors = response?.errors || {};
  const message = response?.message || error?.message || 'Error desconocido';
  const hasImageError = !!fieldErrors.imagen;

  return {
    fieldErrors,
    message,
    hasImageError,
    imageErrors: fieldErrors.imagen || [],
  };
}

/**
 * Extrae solo el mensaje de error de imagen
 * @param {Error} error - Error de Axios
 * @returns {string | null}
 */
export function getImageErrorMessage(error) {
  const { imageErrors, message } = parseImageUploadError(error);

  if (imageErrors.length > 0) {
    return imageErrors[0];
  }

  // Si el error general menciona imagen, devolverlo
  if (message.toLowerCase().includes('imagen') || message.toLowerCase().includes('image')) {
    return message;
  }

  return null;
}

/**
 * Verifica si un error de 422 es relacionado con imagen
 * @param {Error} error - Error de Axios
 * @returns {boolean}
 */
export function isImageUploadError(error) {
  return error?.response?.status === 422 && parseImageUploadError(error).hasImageError;
}
