import { instrumentEvaluationConfiguration } from '@aula/shared'
import { scoreInstrumentFields } from '../../services/instrumentScoring'
import { formatInstrumentNumber, instrumentTypographyClass } from './instrumentEditorShared'

/** The same canonical configuration supplies preview, saved detail and evaluation. */
export function ReadOnlyInstrument({
  type,
  fields,
  maxScore,
}: {
  type?: string
  fields: Record<string, string>
  maxScore: number
  accent?: unknown
}) {
  const pending = maxScore <= 0 || fields[`${type}:meta:scorePending`] === 'true'
  const configuration = instrumentEvaluationConfiguration(
    type ?? '',
    pending ? scoreInstrumentFields(fields, type ?? '', 100) : fields,
    pending ? 100 : maxScore,
  )
  if (!configuration.criteria.length)
    return (
      <p className="rounded-xl bg-muted/30 p-4 text-sm text-muted-foreground">
        El instrumento está incompleto. Completa sus criterios, niveles y puntuaciones para ver la
        versión final.
      </p>
    )
  const highest = Math.max(...configuration.levels.map((level) => level.points))
  return (
    <div className={instrumentTypographyClass(type, fields)}>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[36rem] text-sm">
          <thead className="bg-muted/30 text-foreground">
            <tr>
              <th className="border-b border-border p-3 text-left">Criterio / indicador</th>
              {configuration.levels.map((level, index) => (
                <th key={index} className="border-b border-border p-3 text-center">
                  {level.label}
                  <span className="block text-xs font-normal text-muted-foreground">
                    Valor relativo: {formatInstrumentNumber(level.points)}
                  </span>
                </th>
              ))}
              {configuration.noApply ? (
                <th className="border-b border-border p-3">No aplica</th>
              ) : null}
              <th className="border-b border-border p-3">Máximo</th>
            </tr>
          </thead>
          <tbody>
            {configuration.criteria.map((criterion, index) => (
              <tr key={criterion.id ?? index}>
                <td className="border-b border-border p-3">
                  <strong>{criterion.title}</strong>
                  <p className="mt-1 text-xs text-muted-foreground">{criterion.description}</p>
                </td>
                {configuration.levels.map((level, levelIndex) => (
                  <td key={levelIndex} className="border-b border-border p-3 text-center">
                    <span className="block">{criterion.descriptors?.[levelIndex] ?? '—'}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {pending
                        ? '—'
                        : Math.round(((criterion.maximum * level.points) / highest) * 100) /
                          100}{' '}
                      pts
                    </span>
                  </td>
                ))}
                {configuration.noApply ? (
                  <td className="border-b border-border p-3 text-center text-muted-foreground">
                    Excluido y redistribuido
                  </td>
                ) : null}
                <td className="border-b border-border p-3 text-center font-semibold">
                  {pending ? '—' : criterion.maximum} pts
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-right text-sm font-semibold text-foreground">
        Puntuación máxima: {pending ? '—' : maxScore} pts
      </p>
      {configuration.noApply ? (
        <p className="mt-2 text-xs text-muted-foreground">
          No aplica redistribuye el total entre los criterios aplicables. Al evaluar se muestra el
          máximo efectivo y el redondeo final de cada criterio.
        </p>
      ) : null}
    </div>
  )
}
