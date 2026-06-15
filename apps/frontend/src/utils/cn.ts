/**
 * Utilidad para combinar clases CSS condicionalmente.
 * Filtra valores falsy y une con espacio.
 *
 * @param classes - Lista de clases CSS o valores falsy.
 * @returns Cadena de clases separadas por espacio.
 */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}
