/* =========================================================
   VALIDACIONES DE PRODUCTO
   ========================================================= */

/**
 * Solo letras y espacios
 */
export function validarNombre(nombre) {
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

  return regex.test(nombre.trim());
}

/**
 * Solo números positivos
 */
export function validarPrecio(precio) {
  const numero = Number(precio);

  return !isNaN(numero) && numero > 0;
}

/**
 * Campo vacío
 */
export function estaVacio(valor) {
  return !valor || valor.trim() === "";
}