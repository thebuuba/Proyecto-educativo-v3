import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'

const base = 'http://localhost:5173/api/v1'
const health = (await fetch(base + '/health').then(response => response.json())).data
assert.equal(health.development.supabaseOrigin, 'http://127.0.0.1:54321')
const account = JSON.parse(readFileSync('.dev-qa-account.local', 'utf8'))
const response = await fetch(base + '/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(account) })
assert.equal(response.status, 201)
const cookie = response.headers.getSetCookie().find(value => value.startsWith('aulabase_session='))?.split(';')[0]
assert(cookie)
const savedResponse = await fetch(base + '/activities', { headers: { cookie } })
assert.equal(savedResponse.status, 200)
const activities = (await savedResponse.json()).data
const controls = activities.filter(row => ['PROJECT', 'EXERCISE_SET', 'NEWS_WRITING', 'TOURIST_GUIDE_CREATION'].includes(row.pedagogicalActivityType))
assert(controls.length >= 3, 'Primero guardar los tres controles desde el navegador.')
for (const activity of controls) {
  assert(activity.instrumentSnapshot, 'Falta snapshot persistido.')
  assert(activity.instrumentSnapshot.catalogVersion.startsWith('evaluation-2026.'), 'Se guardó una alternativa local en lugar del servicio.')
  assert.equal(activity.instrumentSnapshot.totalScoreUnits, Math.round(activity.maxScore * 100))
}
const news = controls.find(row => row.pedagogicalActivityType === 'NEWS_WRITING')
assert.equal(news.instrumentSnapshot.catalogVersion, 'evaluation-2026.11')
assert.equal(news.instrumentCriteria['rubrica:descriptor:0:1'], 'No presenta un hecho noticioso reconocible.')
const guide = controls.find(row => row.pedagogicalActivityType === 'TOURIST_GUIDE_CREATION')
if (guide) {
  assert.equal(guide.instrumentSnapshot.catalogVersion, 'evaluation-2026.12')
  assert.equal(guide.instrumentType, 'lista-ponderada')
  assert(guide.instrumentSnapshot.criteria.every(row => row.description.includes('Parcial (50%):')))
  assert(guide.instrumentSnapshot.criteria.some(row => row.templateId === 'guide-visual' && row.description.includes('alternativas solicitadas')))
}
writeFileSync('docs/curriculum/cobertura-secundaria/evidencias/guardados-navegador-normal.json', JSON.stringify({ health, authentication: 'PASSWORD_LOGIN_REAL', controls }, null, 2) + '\n')
console.log(`${controls.length} actividades guardadas desde navegador y recuperadas por API normal. Snapshots del servicio, puntos exactos y descriptor específico de noticia comprobados.`)
