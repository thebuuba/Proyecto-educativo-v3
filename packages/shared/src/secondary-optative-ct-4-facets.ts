import type {CommonScienceTopic} from './secondary-science-common-types'

type Facet = {match: string; label: string; relation?: string}
const facet = (label: string, relation?: string, match?: string): Facet => ({
  label, relation,
  match: match ?? label.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase(),
})

/** Requested objects within compound curricular rows; they do not add content. */
const facets: Record<string, Facet[]> = {
  'disease-groups': [
    facet('fisiología humana', 'las funciones y relaciones de los sistemas humanos expresamente solicitados en el modelo y las fuentes proporcionados, sin exigir diagnósticos ni procedimientos en personas'),
    facet('mecanismos nervioso y endocrino', 'las funciones y relaciones de los mecanismos nervioso y endocrino expresamente solicitados en el modelo proporcionado y su relación con las condiciones dadas, sin exigir diagnósticos ni tratamientos'),
    facet('enfermedades infecciosas'),
    facet('enfermedades endocrinas'),
    facet('enfermedades nutricionales'),
    facet('enfermedades del sistema nervioso'),
    facet('enfermedades del sistema circulatorio'),
    facet('enfermedades del sistema respiratorio'),
    facet('enfermedades del sistema digestivo'),
    facet('enfermedades de la piel'),
    facet('enfermedades del sistema músculo-esquelético', undefined, 'enfermedades del sistema musculo[ -]esqueletico'),
  ],
  'mental-health': [
    facet('esquizofrenia'), facet('depresión'), facet('trastorno afectivo bipolar'),
    facet('ansiedad generalizada'), facet('anorexia'), facet('bulimia nerviosa'),
  ],
  'injury-poisoning': [
    facet('traumatismos'), facet('envenenamientos'), facet('accidentes de tránsito'),
    facet('intoxicación por fármacos'), facet('intoxicación por sustancias no medicinales'),
  ],
  'pregnancy-complications': [
    facet('hipertensión en el embarazo'), facet('sepsis puerperal'),
    facet('malformaciones congénitas'), facet('anomalías cromosómicas'),
  ],
  'waste-management': [
    facet('residuos sólidos', 'las propiedades, clasificación y medidas de manejo del residuo sólido del modelo dado, sin exigir manipulación real de muestras'),
    facet('residuos médicos', 'las propiedades y medidas de manejo indicadas en la ficha profesional del caso ficticio, sin exigir manipulación real de muestras'),
    facet('residuos radiactivos', 'las propiedades y medidas de manejo descritas en las fuentes profesionales del modelo dado, sin exigir manipulación real de muestras', 'residuos (?:radiactivos|radioactivos)'),
    facet('residuos peligrosos', 'las propiedades y medidas de manejo descritas en la ficha profesional del caso dado, sin exigir manipulación real de muestras'),
  ],
  'water-resources': [
    facet('ciclo del agua', 'las transferencias y cambios de estado del agua entre los reservorios del modelo proporcionado, conservando la materia y sin exigir datos de una cuenca ausente'),
    facet('calidad del agua', 'las variables, unidades y referencias de calidad indicadas en los datos proporcionados, sin inferir potabilidad únicamente por apariencia'),
    facet('manejo de cuencas', 'las relaciones entre captación, uso, escurrimiento y medidas del modelo de cuenca proporcionado, sin proponer intervenciones reales'),
    facet('distribución del agua', 'la distribución entre los reservorios representados en las fuentes y su escala, sin inventar proporciones ausentes'),
    facet('escorrentía', 'el movimiento superficial del agua bajo las condiciones del modelo y sus relaciones con infiltración, relieve y cobertura cuando estén proporcionadas'),
  ],
  'atmosphere-climate': [
    facet('capas de la atmósfera', 'la organización vertical de las capas indicadas y las características que permiten distinguirlas según el modelo proporcionado'),
    facet('composición química de la atmósfera', 'los componentes y proporciones indicados por las fuentes dadas, distinguiendo composición de organización vertical'),
    facet('energía en la atmósfera', 'las transferencias y el balance de energía del modelo atmosférico proporcionado, sin inventar valores ausentes'),
    facet('efecto invernadero', 'la absorción y emisión de radiación infrarroja por los gases del modelo dado y su relación con el balance energético'),
    facet('circulación del aire', 'las diferencias de presión, temperatura y movimiento del aire en la escala del modelo proporcionado'),
    facet('variabilidad climática', 'las fluctuaciones de las variables climáticas en la escala temporal y espacial de los datos dados, sin confundir una observación aislada con una tendencia'),
    facet('calentamiento global', 'la tendencia de la temperatura media global y su relación con el balance energético según las evidencias y escalas de las fuentes dadas'),
    facet('cambio climático', 'los cambios sostenidos de las variables climáticas y sus escalas según las evidencias proporcionadas, distinguiendo observaciones de inferencias causales'),
    facet('capa de ozono', 'la ubicación y el papel del ozono estratosférico en la absorción de radiación ultravioleta según el modelo proporcionado'),
    facet('temperatura en diferentes zonas', 'las diferencias espaciales de temperatura y las condiciones de comparación de los datos proporcionados, conservando unidades y escala'),
  ],
  'natural-risk-models': [
    facet('huracanes'), facet('deslizamientos'), facet('inundaciones'),
    facet('terremotos'), facet('tsunamis'), facet('sistema de emergencia'),
  ],
  'mineral-resources': [
    facet('exploración minera', 'la localización y caracterización de yacimientos según las evidencias del estudio proporcionado, sin atribuir extracción de materiales a una prospección'),
    facet('explotación minera', 'la extracción y las relaciones económicas o ambientales descritas en las fuentes del caso dado, sin inventar permisos o actividades actuales'),
    facet('recursos mineros dominicanos', 'la localización y características de los recursos dominicanos indicados en las fuentes proporcionadas, sin inventar reservas o cifras actuales'),
    facet('mercado mundial de recursos mineros', 'las relaciones de oferta, demanda y uso documentadas en las fuentes proporcionadas, sin inventar precios o tendencias actuales'),
  ],
  'energy-sustainability': [
    facet('energía no renovable', 'la disponibilidad y transformación de los recursos no renovables del caso proporcionado y sus límites, sin equiparar disponibilidad con ausencia de impacto'),
    facet('energía renovable', 'la renovación y las transformaciones de las fuentes del caso dado y sus condiciones, sin equiparar renovable con ausencia de impacto'),
    facet('eficiencia energética', 'la relación entre energía útil y energía de entrada bajo las condiciones y unidades del modelo dado, sin confundir eficiencia con consumo absoluto'),
    facet('historia del uso de energía', 'los cambios documentados de fuentes y usos en su contexto temporal, distinguiendo secuencia de causalidad'),
    facet('demanda de energía dominicana', 'las variables, escala y procedencia de los datos dominicanos proporcionados, sin atribuirles actualidad fuera de su fecha'),
  ],
  'bioreactor-models': [
    facet('biorreactor en fase sólida', 'el medio, entradas, variables y controles del modelo en fase sólida solicitado, sin exigir construcción u operación real'),
    facet('biorreactor en fase líquida', 'el medio, entradas, variables y controles del modelo en fase líquida solicitado, sin exigir construcción u operación real'),
    facet('fotobiorreactor', 'el papel de la luz y las variables del modelo de fotobiorreactor proporcionado, sin exigir construcción u operación real'),
  ],
  'biological-sequences': [
    facet('secuencias de ADN', 'los nucleótidos, posiciones y correspondencias de las secuencias proporcionadas y los límites de las inferencias, sin equiparar similitud con identidad de función', 'secuencias de adn|secuencias de proteinas y adn'),
    facet('secuencias de proteínas', 'los aminoácidos, posiciones y correspondencias de las secuencias proporcionadas y los límites de las inferencias, sin equiparar similitud con identidad de función', 'secuencias de proteinas|secuencias de adn y proteinas'),
    facet('datos genómicos', 'las variables, referencias y relaciones de los datos genómicos proporcionados, sin inferir identidad personal ni enfermedad por una asociación aislada'),
    facet('datos proteómicos', 'las variables, referencias y relaciones de los datos proteómicos proporcionados, sin atribuir función o causalidad sin evidencia'),
    facet('alineamiento de secuencias', 'las posiciones, coincidencias, diferencias y huecos del alineamiento proporcionado bajo sus parámetros, sin inferir función idéntica únicamente por similitud'),
  ],
  'cell-models': [
    facet('célula animal', 'las partes y funciones de la célula animal solicitadas en el modelo dado, sin exigir estructuras de otro tipo celular'),
    facet('célula vegetal', 'las partes y funciones de la célula vegetal solicitadas en el modelo dado, sin exigir estructuras de otro tipo celular'),
  ],
}

function selectedFacets(text: string, topic: CommonScienceTopic) {
  if (topic.grade !== 4) return []
  return (facets[topic.id] ?? []).filter(f => new RegExp(`\\b(?:${f.match})\\b`).test(text))
}

export function matchesCtFourFacet(text: string, topic: CommonScienceTopic) {
  return selectedFacets(text, topic).length > 0
}

export function focusCtFourTopic(text: string, topic: CommonScienceTopic): CommonScienceTopic {
  const selected = selectedFacets(text, topic)
  if (!selected.length) return topic
  return {
    ...topic,
    label: selected.map(f => f.label).join(' y '),
    relation: selected.map(f => f.relation ?? topic.relation).filter((v, i, all) => all.indexOf(v) === i).join('; '),
  }
}
