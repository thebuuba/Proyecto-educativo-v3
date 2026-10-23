import type {EvaluationCatalog} from './catalog-current'
import {evaluationCatalogV150} from './catalog-v150'
/** Catálogo151 contrastado con Development; no reescribir referencias históricas. */
export const evaluationCatalogV151={...evaluationCatalogV150,version:'evaluation-2026.151',
 scienceCommonModules:evaluationCatalogV150.scienceCommonModules!.map(m=>m.grade!==5?m:{...m,topics:m.topics.map(t=>t.id!=='periodic-position'?t:{...t,match:"grupos?\\s*(?:,\\s*|y\\s+)?periodos?|ubicacion.*tabla periodica|posicion.*tabla periodica|tabla periodica.*(?:grupos?|periodos?|posicion|ubicacion)"})}),
 technicalModules:evaluationCatalogV150.technicalModules!.map(m=>m.moduleCode!=='MF_002_3'?m:{...m,topics:m.topics.map(t=>t.id==='document'?{...t,match:"documentos? de texto|documentos? (?:de|en) (?:microsoft )?word|procesador de textos|procesador de palabras"}:t.id==='text-format'?{...t,match:"fuente|fuentes (?:tipograficas|de letra)|parrafos?|sangrias?|tabulaciones?|formato de texto|interlineado|arial|calibri|times new roman"}:t)}),
} as unknown as EvaluationCatalog
