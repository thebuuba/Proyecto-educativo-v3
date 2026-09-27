// Context corrections only. Never rewrite originalText. Visually checked against
// the immutable 2023 PDFs; surrounding pages are part of the evidence.
export const sourceAnomalies = [
  {
    level: 'PRIMARY',
    pages: [207],
    patch: { grade: 3, cycle: 1 },
    literal: '2do. Grado',
    evidence: [206, 207, 208],
    reason:
      'Continuation between the opening 3er. Grado table (206) and its 3er. Grado indicators (208); no new competencies on 207.',
  },
  {
    level: 'PRIMARY',
    pages: [221, 222],
    patch: { areaName: 'Educación Artística' },
    literal: 'Área de Educación Física',
    evidence: [219, 220, 221, 222],
    reason:
      'Artística chapter: grade 2 ends on 220; grade 3 starts on 221 with artistic languages, clown, music, theatre; indicators on 222 are artistic.',
  },
  {
    level: 'PRIMARY',
    pages: [319, 320],
    patch: { grade: 5, cycle: 2 },
    literal: '4to. Grado',
    evidence: [318, 319, 320, 321, 322],
    reason:
      'Continuation of grade 5 opening on 318; indicators on 321 refer to the same fossils, nervous system, atoms and Earth topics; grade 6 starts on 322.',
  },
  {
    level: 'PRIMARY',
    pages: [348],
    patch: { grade: 6, cycle: 2 },
    literal: '5to. Grado',
    evidence: [347, 348, 349],
    reason:
      'Grade 6 starts on 347; vocabulary/discursive procedures continue on 348; indicators on 349 continue the past/future and health contexts.',
  },
  {
    level: 'PRIMARY',
    pages: [363],
    patch: { grade: 6, cycle: 2 },
    literal: '5to. Grado',
    evidence: [362, 363, 364],
    reason:
      'Grade 6 opening on 362; procedures continue on 363 and corresponding indicators on 364, including mate and rolling.',
  },
  {
    level: 'SECONDARY',
    pages: [401],
    patch: { cycle: 1, grade: 3, areaName: 'Formación Integral Humana y Religiosa' },
    literal: 'Nivel Secundario – Segundo Ciclo; 3er. Grado',
    evidence: [398, 400, 401, 402, 405],
    reason:
      'FIHR grade 3 is in first cycle; page 401 explicitly says 3er. Grado, within the first-cycle FIHR sequence before second-cycle chapter.',
  },
]

export function correctedHeader(header, level, page) {
  const anomaly = sourceAnomalies.find((a) => a.level === level && a.pages.includes(page))
  return anomaly
    ? { ...header, ...anomaly.patch, level, sourceAnomalyPages: anomaly.pages }
    : header
}
