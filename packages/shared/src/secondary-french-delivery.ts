import { deliveryCriteria } from './task-delivery-requirements'
import { frenchRequirementText } from './secondary-french-task'

/** Bounded French delivery vocabulary, passed to the existing capacity/contradiction checks. */
export function frenchDeliveryCriteria(description: string) {
  const words: Record<string, string> = { un: '1', une: '1', deux: '2', trois: '3', quatre: '4', cinq: '5', six: '6', sept: '7', huit: '8', neuf: '9', dix: '10', page: 'pagina', pages: 'paginas', phrase: 'oracion', phrases: 'oraciones', paragraphe: 'parrafo', paragraphes: 'parrafos', exemple: 'ejemplo', exemples: 'ejemplos' }
  let text = frenchRequirementText(description)
  // No translation of curricular examples or arbitrary prose; only enumerated delivery tokens.
  if (!/\b(?:pages?|phrases?|paragraphes?|exemples?|interligne|police|couverture)\b/.test(text)) return []
  text = text.replace(/\bau moins\b/g, 'minimo').replace(/\bau plus\b/g, 'maximo').replace(/\bentre (\w+) et (\w+) (pages?)\b/g, 'entre $1 y $2 $3')
    .replace(new RegExp(`\\b(?:${Object.keys(words).join('|')})\\b`, 'g'), word => words[word])
    .replace(/\binterligne\b/g, 'interlineado').replace(/\bpolice\b/g, 'fuente').replace(/\bsans couverture\b/g, 'sin portada').replace(/\bavec (?:(?:1|une?) )?couverture\b/g, 'con portada')
  return deliveryCriteria(text)
}
