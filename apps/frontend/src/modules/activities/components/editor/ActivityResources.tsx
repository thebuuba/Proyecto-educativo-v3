import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/utils/cn'
import {
  Accessibility,
  ArrowRight,
  AudioLines,
  Beaker,
  Blocks,
  BookA,
  BookOpen,
  BookText,
  Box,
  Cable,
  Calculator,
  Camera,
  CheckCircle2,
  ChevronDown,
  Circle,
  CircleDot,
  Clock3,
  Dices,
  DraftingCompass,
  Drama,
  Drum,
  Dumbbell,
  Files,
  FileText,
  Flag,
  Flame,
  FlaskConical,
  Glasses,
  Globe,
  Goal,
  GraduationCap,
  Grid3X3,
  Guitar,
  Hand,
  Hash,
  Headphones,
  Image as ImageIcon,
  Images,
  Keyboard,
  Laptop,
  Layers,
  Lightbulb,
  Link,
  Magnet,
  Map as MapIcon,
  Medal,
  Megaphone,
  MessageSquare,
  Mic,
  Microscope,
  Monitor,
  Music,
  Newspaper,
  NotebookPen,
  Paintbrush,
  Palette,
  PenLine,
  Plus,
  Presentation,
  Printer,
  Projector,
  Puzzle,
  Radio,
  Ruler,
  Scale,
  ScanLine,
  Scissors,
  Search,
  Shapes,
  Shield,
  Smartphone,
  Speaker,
  Tablet,
  Tags,
  Target,
  TestTube,
  Thermometer,
  Timer,
  Triangle,
  Trophy,
  Usb,
  Users,
  Video,
  Volume2,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'

export const commonActivityResources = [
  'Computadora',
  'Proyector',
  'Pantalla o televisión',
  'Internet',
  'Presentación PowerPoint',
  'Pizarra',
  'Marcadores',
  'Hojas en blanco',
  'Cuaderno',
  'Libro de texto',
  'Lápices',
  'Bolígrafo',
  'Cartulina',
  'Material impreso',
  'Regla',
  'Plataforma educativa',
]

export const resourceBankCategories = [
  {
    id: 'technology',
    label: 'Tecnología y audiovisuales',
    resources: [
      'Tableta',
      'Dispositivo móvil',
      'Pantalla interactiva',
      'Cámara',
      'Webcam',
      'Trípode',
      'Micrófono',
      'Altavoces',
      'Audífonos',
      'Impresora',
      'Escáner',
      'Memoria USB',
      'Cable HDMI',
      'Grabadora de audio',
      'Video',
      'Podcast',
      'Simulador virtual',
      'Software educativo',
    ],
  },
  {
    id: 'math',
    label: 'Matemáticas y geometría',
    resources: [
      'Calculadora',
      'Compás',
      'Transportador',
      'Escuadra',
      'Cartabón',
      'Figuras geométricas',
      'Cuerpos geométricos',
      'Ábaco',
      'Bloques base diez',
      'Regletas de Cuisenaire',
      'Geoplano',
      'Tangram',
      'Dados',
      'Balanza matemática',
      'Cinta métrica',
      'Fracciones circulares',
      'Plano cartesiano',
      'Fichas de conteo',
      'Dominó matemático',
      'Papel cuadriculado',
    ],
  },
  {
    id: 'science',
    label: 'Ciencias y laboratorio',
    resources: [
      'Probeta',
      'Vaso de precipitados',
      'Tubos de ensayo',
      'Gradilla',
      'Matraz Erlenmeyer',
      'Pipeta',
      'Gotero',
      'Embudo',
      'Placa Petri',
      'Microscopio',
      'Portaobjetos',
      'Cubreobjetos',
      'Lupa',
      'Termómetro',
      'Balanza de laboratorio',
      'Cronómetro',
      'Mechero',
      'Pinzas',
      'Espátula',
      'Mortero',
      'Reactivos',
      'Guantes de laboratorio',
      'Gafas de seguridad',
      'Bata de laboratorio',
      'Modelo anatómico',
      'Kit de circuitos eléctricos',
      'Imanes',
      'Brújula',
      'Sensor de pH',
      'Papel indicador',
    ],
  },
  {
    id: 'language',
    label: 'Lengua y comunicación',
    resources: [
      'Diccionario',
      'Cuentos',
      'Novelas',
      'Poemario',
      'Tarjetas de vocabulario',
      'Fichas de lectura',
      'Periódico',
      'Revistas',
      'Imágenes secuenciales',
      'Letras móviles',
      'Audiolibro',
      'Guion teatral',
      'Títeres',
      'Láminas ilustradas',
      'Organizador gráfico',
      'Tarjetas de comprensión',
    ],
  },
  {
    id: 'social',
    label: 'Ciencias sociales y humanidades',
    resources: [
      'Mapamundi',
      'Globo terráqueo',
      'Mapa político',
      'Mapa físico',
      'Atlas',
      'Línea del tiempo',
      'Documentos históricos',
      'Fotografías históricas',
      'Biografías',
      'Brújula',
      'Maqueta geográfica',
      'Banderas',
      'Infografías',
      'Fichas culturales',
      'Mapa conceptual',
      'Fuentes primarias',
    ],
  },
  {
    id: 'arts',
    label: 'Artes y manualidades',
    resources: [
      'Pintura acrílica',
      'Acuarelas',
      'Témperas',
      'Pinceles',
      'Lápices de colores',
      'Crayones',
      'Lienzo',
      'Papel de construcción',
      'Arcilla',
      'Plastilina',
      'Tijeras',
      'Pegamento',
      'Plantillas',
      'Caballete',
      'Paleta de pintura',
      'Materiales reciclados',
      'Papel crepé',
      'Foami',
      'Cinta adhesiva',
      'Hilo y lana',
    ],
  },
  {
    id: 'music',
    label: 'Música y expresión escénica',
    resources: [
      'Flauta',
      'Guitarra',
      'Teclado musical',
      'Tambor',
      'Maracas',
      'Pandereta',
      'Xilófono',
      'Güira',
      'Metrónomo',
      'Partituras',
      'Atril',
      'Pistas musicales',
      'Vestuario',
      'Máscaras',
      'Utilería',
      'Luces escénicas',
      'Instrumentos de percusión',
      'Cancionero',
    ],
  },
  {
    id: 'physical',
    label: 'Educación física y recreación',
    resources: [
      'Balón de fútbol',
      'Balón de baloncesto',
      'Balón de voleibol',
      'Pelotas pequeñas',
      'Conos',
      'Aros',
      'Cuerdas para saltar',
      'Cronómetro deportivo',
      'Silbato',
      'Colchonetas',
      'Red deportiva',
      'Portería',
      'Raquetas',
      'Bates',
      'Testigos de relevo',
      'Petos deportivos',
      'Obstáculos',
      'Escalera de agilidad',
      'Bandas elásticas',
      'Paracaídas recreativo',
      'Discos voladores',
      'Sacos para carrera',
    ],
  },
  {
    id: 'early',
    label: 'Inicial y manipulativos',
    resources: [
      'Bloques de construcción',
      'Rompecabezas',
      'Encajables',
      'Números móviles',
      'Formas clasificables',
      'Cuentas para ensartar',
      'Pinzas de motricidad',
      'Tableros didácticos',
      'Juego de memoria',
      'Tarjetas sensoriales',
      'Cubos apilables',
      'Clasificadores de colores',
      'Animales de juguete',
      'Reloj didáctico',
      'Letras magnéticas',
      'Caja de arena',
    ],
  },
  {
    id: 'inclusion',
    label: 'Inclusión y apoyo sensorial',
    resources: [
      'Pictogramas',
      'Tarjetas de comunicación',
      'Temporizador visual',
      'Audífonos reductores de ruido',
      'Objetos antiestrés',
      'Cojín sensorial',
      'Panel de texturas',
      'Tablero de rutinas',
      'Letras de alto contraste',
      'Lupa de lectura',
      'Material táctil',
      'Teclado adaptado',
      'Agarre para lápiz',
      'Mesa de luz',
      'Pelota sensorial',
      'Comunicador alternativo',
    ],
  },
] as const

export const allCatalogResources = [
  ...new Set([
    ...commonActivityResources,
    ...resourceBankCategories.flatMap((category) => category.resources),
  ]),
]

export function ResourcePicker({
  resources,
  onChange,
}: {
  resources: string[]
  onChange: (resources: string[]) => void
}) {
  const [customResource, setCustomResource] = useState('')
  const [customResources, setCustomResources] = useState<string[]>([])
  const [recentResources, setRecentResources] = useState<string[]>([])
  const [resourceQuery, setResourceQuery] = useState('')
  const [showOptions, setShowOptions] = useState(false)
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [showBank, setShowBank] = useState(false)
  const [showMyResources, setShowMyResources] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const normalizedQuery = resourceQuery.trim().toLocaleLowerCase()
  const filteredResources = [...new Set([...allCatalogResources, ...customResources])].filter(
    (resource) => resource.toLocaleLowerCase().includes(normalizedQuery),
  )

  useEffect(() => {
    try {
      const storedCustom = JSON.parse(
        window.localStorage.getItem('grading-custom-resources') || '[]',
      )
      const storedRecent = JSON.parse(
        window.localStorage.getItem('grading-recent-resources') || '[]',
      )
      setCustomResources(
        Array.isArray(storedCustom)
          ? storedCustom.filter((item): item is string => typeof item === 'string')
          : [],
      )
      setRecentResources(
        Array.isArray(storedRecent)
          ? storedRecent.filter((item): item is string => typeof item === 'string').slice(0, 8)
          : [],
      )
    } catch {
      setCustomResources([])
      setRecentResources([])
    }
  }, [])

  function rememberResource(resource: string) {
    const next = [resource, ...recentResources.filter((item) => item !== resource)].slice(0, 8)
    setRecentResources(next)
    try {
      window.localStorage.setItem('grading-recent-resources', JSON.stringify(next))
    } catch {
      /* Optional preference. */
    }
  }

  function toggleResource(resource: string) {
    if (resources.includes(resource)) {
      onChange(resources.filter((item) => item !== resource))
      return
    }
    onChange([...resources, resource])
    rememberResource(resource)
  }

  function addCustomResource() {
    const value = customResource.trim()
    if (!value) return
    const existing = [...allCatalogResources, ...customResources].find(
      (item) => item.toLocaleLowerCase() === value.toLocaleLowerCase(),
    )
    const resource = existing ?? value
    if (!existing) {
      const nextCustom = [resource, ...customResources]
      setCustomResources(nextCustom)
      try {
        window.localStorage.setItem('grading-custom-resources', JSON.stringify(nextCustom))
      } catch {
        /* Optional preference. */
      }
    }
    if (!resources.some((item) => item.toLocaleLowerCase() === resource.toLocaleLowerCase()))
      onChange([...resources, resource])
    rememberResource(resource)
    setCustomResource('')
    setShowCustomInput(false)
  }

  function resourceButton(resource: string) {
    return (
      <button
        key={resource}
        type="button"
        className={cn(
          'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition',
          resources.includes(resource)
            ? 'border-primary/30 bg-primary/10 text-primary'
            : 'border-border bg-card text-muted-foreground hover:border-primary hover:text-primary',
        )}
        onClick={() => toggleResource(resource)}
      >
        {resourceIcon(resource)}
        {resource}
        {resources.includes(resource) ? <CheckCircle2 className="size-3.5" /> : null}
      </button>
    )
  }

  return (
    <div className="space-y-2.5">
      <p className="text-xs text-primary">
        Selecciona los recursos que utilizarás en esta actividad.
      </p>
      <div
        className="relative"
        onMouseEnter={() => setShowOptions(true)}
        onMouseLeave={() => setShowOptions(false)}
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="h-11 pl-10 pr-10"
          value={resourceQuery}
          onFocus={() => setShowOptions(true)}
          onClick={() => setShowOptions(true)}
          onChange={(event) => {
            setResourceQuery(event.target.value)
            setShowOptions(true)
          }}
          placeholder="Buscar o agregar recurso..."
        />
        <button data-ui-size="icon"
          type="button"
          aria-label="Mostrar recursos"
          className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center text-primary"
          onClick={() => setShowOptions((value) => !value)}
        >
          <ChevronDown className={cn('size-4 transition', showOptions ? 'rotate-180' : '')} />
        </button>
        {showOptions ? (
          <div className="absolute inset-x-0 top-full z-20 mt-1 rounded-xl border border-border bg-popover p-2 shadow-lg">
            <div className="max-h-52 space-y-2 overflow-y-auto">
              {normalizedQuery ? (
                <div className="flex flex-wrap gap-1.5">
                  {filteredResources.map(resourceButton)}
                  {filteredResources.length === 0 ? (
                    <p className="px-2 py-3 text-xs text-muted-foreground">
                      Sin coincidencias. Agrégalo como recurso personalizado.
                    </p>
                  ) : null}
                </div>
              ) : (
                <>
                  {recentResources.length > 0 ? (
                    <div>
                      <p className="mb-1.5 px-1 text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">
                        Usados recientemente
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {recentResources.map(resourceButton)}
                      </div>
                    </div>
                  ) : null}
                  <div>
                    <p className="mb-1.5 px-1 text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">
                      Recursos comunes
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {commonActivityResources.map(resourceButton)}
                    </div>
                  </div>
                  {customResources.length > 0 ? (
                    <div>
                      <p className="mb-1.5 px-1 text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">
                        Mis recursos
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {customResources.slice(0, 6).map(resourceButton)}
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </div>
            <button
              type="button"
              className="mt-2 flex w-full items-center justify-between border-t border-border px-2 pt-2 text-left text-xs font-black text-primary hover:underline"
              onClick={() => {
                setShowOptions(false)
                setShowBank(true)
              }}
            >
              <span>Explorar banco completo por áreas</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        ) : null}
      </div>
      {resources.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {resources.map((resource) => (
            <button
              key={resource}
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 text-xs font-black text-primary transition hover:border-primary/30"
              onClick={() => toggleResource(resource)}
            >
              {resourceIcon(resource)}
              {resource}
              <X className="size-3.5 text-muted-foreground" />
            </button>
          ))}
        </div>
      ) : null}
      <div
        className="space-y-2"
        onMouseEnter={() => setShowMyResources(true)}
        onMouseLeave={() => setShowMyResources(false)}
      >
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-lg border border-primary/30 bg-primary/30 px-3 py-2.5 text-left text-sm font-black text-primary transition hover:border-primary/30 hover:bg-primary/70"
          onClick={() => {
            setShowMyResources((value) => !value)
            setShowOptions(false)
          }}
        >
          <span className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-primary/10">
              <Plus className="size-4" />
            </span>
            <span>
              <span className="block">Mis recursos</span>
              <span className="mt-0.5 block text-xs font-medium text-primary">
                {customResources.length} recursos personalizados
              </span>
            </span>
          </span>
          <ChevronDown className={cn('size-4 transition', showMyResources ? 'rotate-180' : '')} />
        </button>
        {showMyResources ? (
          <div className="rounded-lg border border-primary/30 bg-primary/20 p-3">
            {customResources.length ? (
              <div className="flex flex-wrap gap-1.5">{customResources.map(resourceButton)}</div>
            ) : (
              <p className="text-xs text-primary">
                Los recursos personalizados que agregues aparecerán aquí.
              </p>
            )}
          </div>
        ) : null}
      </div>
      {showBank ? (
        <div
          className="rounded-xl border border-border bg-muted/10 p-2"
          onMouseLeave={() => {
            setShowBank(false)
            setExpandedCategory(null)
          }}
        >
          <div className="mb-2 flex items-center justify-between px-1">
            <div>
              <p className="text-sm font-black text-primary">Banco de recursos por áreas</p>
              <p className="text-xs text-primary">
                {allCatalogResources.length} recursos disponibles
              </p>
            </div>
            <button data-ui-action="close" data-ui-size="icon"
              type="button"
              aria-label="Cerrar banco de recursos"
              className="grid size-8 place-items-center rounded-lg text-primary hover:bg-primary/10"
              onClick={() => setShowBank(false)}
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="max-h-80 space-y-1 overflow-y-auto pr-1">
            {resourceBankCategories.map((category) => {
              const open = expandedCategory === category.id
              return (
                <div
                  key={category.id}
                  className="overflow-hidden rounded-lg border border-primary/30 bg-card"
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left"
                    onClick={() => setExpandedCategory(open ? null : category.id)}
                  >
                    <span className="flex items-center gap-2">
                      <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                        {resourceCategoryIcon(category.id)}
                      </span>
                      <span>
                        <span className="block text-sm font-black text-primary">
                          {category.label}
                        </span>
                        <span className="block text-xs text-primary">
                          {category.resources.length} recursos
                        </span>
                      </span>
                    </span>
                    <ChevronDown
                      className={cn('size-4 text-primary transition', open ? 'rotate-180' : '')}
                    />
                  </button>
                  {open ? (
                    <div className="flex flex-wrap gap-1.5 border-t border-primary/30 bg-primary/20 p-3">
                      {category.resources.map(resourceButton)}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      ) : null}
      {showCustomInput ? (
        <div className="flex gap-2">
          <Input
            className="h-9"
            autoFocus
            value={customResource}
            placeholder="Ej. Simulador PhET de circuitos"
            onChange={(event) => setCustomResource(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== 'Enter') return
              event.preventDefault()
              addCustomResource()
            }}
          />
          <Button type="button" size="sm" className="h-9" onClick={addCustomResource}>
            Agregar
          </Button>
          <Button data-ui-action="cancel"
            type="button"
            size="sm"
            variant="ghost"
            className="h-9"
            onClick={() => setShowCustomInput(false)}
          >
            Cancelar
          </Button>
        </div>
      ) : (
        <button
          type="button"
          className="inline-flex items-center gap-2 text-sm font-black text-primary hover:underline"
          onClick={() => {
            setShowCustomInput(true)
            setShowOptions(false)
          }}
        >
          <Plus className="size-4" />
          Agregar recurso personalizado
        </button>
      )}
    </div>
  )
}

export function resourceCategoryIcon(categoryId: string) {
  if (categoryId === 'technology') return <Laptop className="size-4" />
  if (categoryId === 'math') return <Calculator className="size-4" />
  if (categoryId === 'science') return <FlaskConical className="size-4" />
  if (categoryId === 'language') return <BookOpen className="size-4" />
  if (categoryId === 'social') return <MapIcon className="size-4" />
  if (categoryId === 'arts') return <Palette className="size-4" />
  if (categoryId === 'music') return <Speaker className="size-4" />
  if (categoryId === 'physical') return <Trophy className="size-4" />
  if (categoryId === 'early') return <Puzzle className="size-4" />
  return <Accessibility className="size-4" />
}

export function resourceIcon(resource: string) {
  const value = resource.toLocaleLowerCase()
  const has = (...terms: string[]) => terms.some((term) => value.includes(term))
  const iconClass = cn('size-4', resourceIconColor(resource))

  if (has('computadora', 'portátil', 'software educativo', 'simulador virtual'))
    return <Laptop className={iconClass} />
  if (has('tableta')) return <Tablet className={iconClass} />
  if (has('dispositivo móvil', 'celular')) return <Smartphone className={iconClass} />
  if (has('proyector')) return <Projector className={iconClass} />
  if (has('powerpoint', 'diapositiva', 'pizarra')) return <Presentation className={iconClass} />
  if (has('pantalla', 'televisión')) return <Monitor className={iconClass} />
  if (has('internet', 'wifi', 'globo terráqueo')) return <Globe className={iconClass} />
  if (has('webcam', 'cámara', 'trípode')) return <Camera className={iconClass} />
  if (has('micrófono')) return <Mic className={iconClass} />
  if (has('altavoz', 'bocina')) return <Volume2 className={iconClass} />
  if (has('audífono')) return <Headphones className={iconClass} />
  if (has('impresora', 'material impreso')) return <Printer className={iconClass} />
  if (has('escáner')) return <ScanLine className={iconClass} />
  if (has('memoria usb')) return <Usb className={iconClass} />
  if (has('cable hdmi', 'circuitos eléctricos', 'bandas elásticas', 'cuerdas para saltar'))
    return <Cable className={iconClass} />
  if (has('grabadora', 'podcast')) return <Radio className={iconClass} />
  if (has('video')) return <Video className={iconClass} />

  if (has('calculadora')) return <Calculator className={iconClass} />
  if (has('compás')) return <DraftingCompass className={iconClass} />
  if (has('transportador', 'escuadra', 'cartabón')) return <Triangle className={iconClass} />
  if (has('cinta métrica', 'regla')) return <Ruler className={iconClass} />
  if (has('figuras geométricas', 'formas clasificables', 'fracciones circulares'))
    return <Shapes className={iconClass} />
  if (has('cuerpos geométricos', 'maqueta geográfica', 'caja de arena'))
    return <Box className={iconClass} />
  if (has('ábaco', 'fichas de conteo', 'números móviles')) return <Hash className={iconClass} />
  if (
    has(
      'bloques base diez',
      'regletas de cuisenaire',
      'geoplano',
      'plano cartesiano',
      'papel cuadriculado',
    )
  )
    return <Blocks className={iconClass} />
  if (has('tangram', 'rompecabezas', 'encajables')) return <Puzzle className={iconClass} />
  if (has('dados', 'dominó')) return <Dices className={iconClass} />
  if (has('balanza')) return <Scale className={iconClass} />

  if (has('microscopio')) return <Microscope className={iconClass} />
  if (has('tubos de ensayo')) return <TestTube className={iconClass} />
  if (
    has(
      'probeta',
      'precipitado',
      'gradilla',
      'matraz',
      'pipeta',
      'gotero',
      'embudo',
      'petri',
      'portaobjetos',
      'cubreobjetos',
      'mortero',
      'reactivos',
      'sensor de ph',
    )
  )
    return <Beaker className={iconClass} />
  if (has('lupa')) return <Search className={iconClass} />
  if (has('termómetro')) return <Thermometer className={iconClass} />
  if (has('cronómetro', 'temporizador', 'reloj didáctico', 'metrónomo'))
    return <Timer className={iconClass} />
  if (has('mechero')) return <Flame className={iconClass} />
  if (has('pinzas', 'espátula', 'guantes', 'agarre para lápiz'))
    return <Hand className={iconClass} />
  if (has('gafas de seguridad')) return <Glasses className={iconClass} />
  if (has('bata de laboratorio', 'petos deportivos')) return <Shield className={iconClass} />
  if (has('modelo anatómico')) return <Users className={iconClass} />
  if (has('imanes', 'letras magnéticas')) return <Magnet className={iconClass} />
  if (has('brújula')) return <MapIcon className={iconClass} />

  if (has('diccionario')) return <BookA className={iconClass} />
  if (has('cuentos', 'novelas', 'poemario', 'biografías', 'cancionero'))
    return <BookText className={iconClass} />
  if (has('tarjetas', 'fichas culturales')) return <Tags className={iconClass} />
  if (has('fichas de lectura', 'fuentes primarias', 'documentos históricos'))
    return <Files className={iconClass} />
  if (has('periódico', 'revistas')) return <Newspaper className={iconClass} />
  if (
    has(
      'imágenes secuenciales',
      'láminas ilustradas',
      'fotografías históricas',
      'infografías',
      'pictogramas',
    )
  )
    return <Images className={iconClass} />
  if (has('letras móviles', 'letras de alto contraste')) return <BookA className={iconClass} />
  if (has('audiolibro', 'pistas musicales')) return <AudioLines className={iconClass} />
  if (has('guion teatral', 'títeres', 'vestuario', 'máscaras', 'utilería'))
    return <Drama className={iconClass} />
  if (has('organizador gráfico', 'mapa conceptual', 'tablero de rutinas'))
    return <Blocks className={iconClass} />

  if (has('mapa', 'atlas')) return <MapIcon className={iconClass} />
  if (has('línea del tiempo')) return <Clock3 className={iconClass} />
  if (has('banderas')) return <Flag className={iconClass} />

  if (
    has(
      'pintura',
      'acuarelas',
      'témperas',
      'crayones',
      'arcilla',
      'plastilina',
      'clasificadores de colores',
    )
  )
    return <Palette className={iconClass} />
  if (has('pinceles')) return <Paintbrush className={iconClass} />
  if (has('lápices', 'bolígrafo', 'marcadores')) return <PenLine className={iconClass} />
  if (has('lienzo', 'caballete')) return <ImageIcon className={iconClass} />
  if (has('tijeras')) return <Scissors className={iconClass} />
  if (has('pegamento', 'cinta adhesiva', 'hilo y lana')) return <Link className={iconClass} />
  if (has('plantillas')) return <Shapes className={iconClass} />
  if (has('materiales reciclados')) return <Puzzle className={iconClass} />

  if (has('guitarra')) return <Guitar className={iconClass} />
  if (has('teclado musical', 'teclado adaptado')) return <Keyboard className={iconClass} />
  if (has('tambor', 'pandereta', 'instrumentos de percusión')) return <Drum className={iconClass} />
  if (has('flauta', 'maracas', 'xilófono', 'güira', 'partituras', 'atril'))
    return <Music className={iconClass} />
  if (has('luces escénicas', 'mesa de luz')) return <Lightbulb className={iconClass} />

  if (has('balón', 'pelotas', 'aros', 'discos voladores', 'pelota sensorial'))
    return <Circle className={iconClass} />
  if (has('conos')) return <Triangle className={iconClass} />
  if (has('colchonetas')) return <Layers className={iconClass} />
  if (has('obstáculos')) return <Target className={iconClass} />
  if (has('escalera de agilidad')) return <Ruler className={iconClass} />
  if (has('silbato')) return <Megaphone className={iconClass} />
  if (has('red deportiva')) return <Grid3X3 className={iconClass} />
  if (has('portería')) return <Goal className={iconClass} />
  if (has('raquetas', 'bates')) return <Dumbbell className={iconClass} />
  if (has('testigos de relevo')) return <Medal className={iconClass} />
  if (has('paracaídas recreativo', 'sacos para carrera')) return <CircleDot className={iconClass} />

  if (has('bloques de construcción', 'cubos apilables')) return <Blocks className={iconClass} />
  if (has('cuentas para ensartar')) return <CircleDot className={iconClass} />
  if (has('tableros didácticos', 'juego de memoria')) return <Layers className={iconClass} />
  if (has('animales de juguete')) return <Puzzle className={iconClass} />
  if (has('objetos antiestrés', 'cojín sensorial', 'panel de texturas', 'material táctil'))
    return <Hand className={iconClass} />
  if (has('comunicador alternativo', 'tarjetas de comunicación'))
    return <MessageSquare className={iconClass} />
  if (has('plataforma educativa')) return <GraduationCap className={iconClass} />
  if (has('cuaderno')) return <NotebookPen className={iconClass} />
  if (has('libro')) return <BookOpen className={iconClass} />
  if (has('hojas', 'papel', 'cartulina', 'foami')) return <Files className={iconClass} />
  return <FileText className={iconClass} />
}

export function resourceIconColor(resource: string) {
  const colors = [
    'text-primary',
    'text-muted-foreground',
    'text-success',
    'text-warning-foreground',
    'text-destructive',
    'text-muted-foreground',
    'text-warning-foreground',
    'text-fuchsia-600',
  ]
  const hash = [...resource].reduce((total, character) => total + character.codePointAt(0)!, 0)
  return colors[hash % colors.length]
}
