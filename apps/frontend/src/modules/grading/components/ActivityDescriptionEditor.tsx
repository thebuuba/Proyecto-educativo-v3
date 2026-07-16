import CharacterCount from '@tiptap/extension-character-count'
import { Node, mergeAttributes } from '@tiptap/core'
import TextAlign from '@tiptap/extension-text-align'
import { FontSize, TextStyle } from '@tiptap/extension-text-style'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  AlignCenter, AlignLeft, AlignRight, Bold, Eraser, Expand, Image as ImageIcon, Italic,
  Link, List, ListOrdered, Maximize2, Redo2, Trash2, Underline, Undo2, X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { supabase } from '@/modules/auth/services/supabaseClient'
import { cn } from '@/utils/cn'

const DESCRIPTION_LIMIT = 10_000
const IMAGE_BUCKET = 'activity-description-images'
const FONT_SIZES = ['12', '14', '16', '18', '20', '24', '28', '32']

const ActivityImage = Node.create({
  name: 'activityImage',
  group: 'block',
  atom: true,
  draggable: true,
  selectable: true,
  addAttributes() {
    return {
      src: { default: '' },
      alt: { default: '' },
      caption: { default: '' },
      size: { default: 'medium' },
      align: { default: 'center' },
    }
  },
  parseHTML() {
    return [
      {
        tag: 'figure[data-activity-image]',
        getAttrs: (node) => {
          const figure = node as HTMLElement
          const image = figure.querySelector('img')
          return {
            src: image?.getAttribute('src') ?? '', alt: image?.getAttribute('alt') ?? '',
            caption: figure.querySelector('figcaption')?.textContent ?? '',
            size: figure.dataset.size ?? 'medium', align: figure.dataset.align ?? 'center',
          }
        },
      },
      {
        tag: 'img[src]',
        getAttrs: (node) => ({ src: (node as HTMLElement).getAttribute('src') ?? '', alt: (node as HTMLElement).getAttribute('alt') ?? '' }),
      },
    ]
  },
  renderHTML({ node }) {
    const { src, alt, caption, size, align } = node.attrs
    return ['figure', mergeAttributes({ 'data-activity-image': '', 'data-size': size, 'data-align': align }),
      ['img', { src, alt, draggable: 'false' }],
      ...(caption ? [['figcaption', {}, caption]] : []),
    ]
  },
})

type LinkDialog = { text: string; url: string; error: string } | null
type ImageDialog = { file: File | null; alt: string; caption: string; error: string; replacing: boolean } | null

export function ActivityDescriptionEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [toolbarVersion, setToolbarVersion] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const [linkDialog, setLinkDialog] = useState<LinkDialog>(null)
  const [imageDialog, setImageDialog] = useState<ImageDialog>(null)
  const [uploading, setUploading] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [3] }, link: { openOnClick: false, autolink: true, HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' } } }),
      TextStyle,
      FontSize,
      TextAlign.configure({ types: ['heading', 'paragraph', 'blockquote'] }),
      ActivityImage,
      CharacterCount.configure({ limit: DESCRIPTION_LIMIT }),
    ],
    content: normalizeInitialContent(value),
    editorProps: {
      attributes: {
        class: 'min-h-52 px-4 py-3 text-sm leading-6 text-foreground outline-none',
        'aria-label': 'Descripción de la actividad',
      },
    },
    onUpdate: ({ editor: currentEditor }) => onChange(currentEditor.getHTML()),
    onSelectionUpdate: () => setToolbarVersion((current) => current + 1),
    onTransaction: () => setToolbarVersion((current) => current + 1),
  })

  useEffect(() => {
    if (!editor || editor.isFocused) return
    const normalized = normalizeInitialContent(value)
    if (editor.getHTML() !== normalized) editor.commands.setContent(normalized, { emitUpdate: false })
  }, [editor, value])

  useEffect(() => {
    if (!expanded) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [expanded])

  if (!editor) return null

  const characterCount = editor.storage.characterCount.characters()
  const nearingLimit = characterCount >= 9_000
  const selectedImage = editor.isActive('activityImage')
  const fontSize = selectionFontSize(editor) ?? '14'
  const mixedFontSize = fontSize === 'mixed'
  const blockStyle = editor.isActive('heading', { level: 3 }) ? 'h3' : editor.isActive('blockquote') ? 'blockquote' : 'p'

  function openLinkDialog() {
    if (!editor) return
    const existing = editor.isActive('link')
    if (existing) editor.chain().focus().extendMarkRange('link').run()
    const { from, to } = editor.state.selection
    setLinkDialog({ text: editor.state.doc.textBetween(from, to, ' '), url: existing ? editor.getAttributes('link').href ?? '' : '', error: '' })
  }

  function insertLink() {
    if (!editor || !linkDialog) return
    const text = linkDialog.text.trim()
    const url = normalizeUrl(linkDialog.url)
    if (!text || !url) {
      setLinkDialog({ ...linkDialog, error: !text ? 'Escribe el texto visible del enlace.' : 'Escribe una dirección http o https válida.' })
      return
    }
    const { from, to } = editor.state.selection
    editor.chain().focus().insertContentAt({ from, to }, { type: 'text', text, marks: [{ type: 'link', attrs: { href: url, target: '_blank', rel: 'noopener noreferrer' } }] }).run()
    setLinkDialog(null)
  }

  function removeLink() {
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    setLinkDialog(null)
  }

  async function insertImage() {
    if (!editor || !imageDialog?.file) return
    const file = imageDialog.file
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setImageDialog({ ...imageDialog, error: 'Selecciona una imagen PNG, JPG, JPEG o WebP.' })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageDialog({ ...imageDialog, error: 'La imagen no puede superar los 5 MB.' })
      return
    }
    setUploading(true)
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) {
      setImageDialog({ ...imageDialog, error: 'Tu sesión no está disponible. Inicia sesión nuevamente.' })
      setUploading(false)
      return
    }
    const extension = file.name.split('.').pop()?.toLocaleLowerCase() || 'jpg'
    const path = `${userData.user.id}/${crypto.randomUUID()}.${extension}`
    const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, file, { contentType: file.type, upsert: false })
    if (error) {
      setImageDialog({ ...imageDialog, error: `No se pudo subir la imagen: ${error.message}` })
      setUploading(false)
      return
    }
    const publicUrl = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl
    const attrs = { src: publicUrl, alt: imageDialog.alt.trim(), caption: imageDialog.caption.trim(), size: 'medium', align: 'center' }
    if (imageDialog.replacing && editor.isActive('activityImage')) editor.chain().focus().updateAttributes('activityImage', attrs).run()
    else editor.chain().focus().insertContent({ type: 'activityImage', attrs }).run()
    setImageDialog(null)
    setUploading(false)
  }

  function updateImage(attrs: Record<string, string>) {
    editor.chain().focus().updateAttributes('activityImage', attrs).run()
  }

  function openImageDialog() {
    setImageDialog({ file: null, alt: '', caption: '', error: '', replacing: false })
  }

  function openReplaceImageDialog() {
    setImageDialog({ file: null, alt: editor.getAttributes('activityImage').alt ?? '', caption: editor.getAttributes('activityImage').caption ?? '', error: '', replacing: true })
  }

  const toolbarButton = (label: string, icon: React.ReactNode, action: () => void, active = false, disabled = false) => (
    <button type="button" aria-label={label} aria-pressed={active} title={label} disabled={disabled} className={cn('grid size-8 shrink-0 place-items-center rounded-md text-slate-600 transition hover:bg-blue-50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-35', active && 'bg-blue-100 text-blue-700 ring-1 ring-blue-200')} onMouseDown={(event) => { event.preventDefault(); action() }}>{icon}</button>
  )

  return (
    <div className={cn(expanded && 'fixed inset-4 z-[80] flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl')}>
      {expanded ? <div className="flex items-center justify-between border-b border-border px-4 py-3"><div><p className="font-black text-primary">Descripción de la actividad</p><p className="text-xs text-muted-foreground">Modo ampliado</p></div><Button type="button" size="sm" variant="ghost" onClick={() => setExpanded(false)}><X className="mr-2 size-4" />Volver al formulario</Button></div> : null}
      <div className={cn('overflow-hidden rounded-xl border border-input bg-card focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15', expanded && 'flex min-h-0 flex-1 flex-col rounded-none border-0 focus-within:ring-0')} data-toolbar-version={toolbarVersion}>
        <div className="flex flex-wrap items-center gap-1 border-b border-border px-2 py-1.5">
          <Select aria-label="Estilo de bloque" className="h-8 w-32 border-0 bg-transparent text-sm font-bold shadow-none" value={blockStyle} onChange={(event) => { const style = event.target.value; if (style === 'h3') editor.chain().focus().setHeading({ level: 3 }).run(); else if (style === 'blockquote') editor.chain().focus().setBlockquote().run(); else editor.chain().focus().setParagraph().run() }}><option value="p">Párrafo</option><option value="h3">Subtítulo</option><option value="blockquote">Cita</option></Select>
          <Select aria-label="Tamaño de letra" title="Tamaño de letra" className="h-8 w-20 border-0 bg-transparent text-sm font-bold shadow-none" value={mixedFontSize ? 'mixed' : fontSize} onChange={(event) => editor.chain().focus().setFontSize(`${event.target.value}px`).run()}><option value="mixed" disabled>Mixto</option>{FONT_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}</Select>
          <ToolbarDivider />
          {toolbarButton('Negrita', <Bold className="size-4" />, () => editor.chain().focus().toggleBold().run(), editor.isActive('bold'))}
          {toolbarButton('Cursiva', <Italic className="size-4" />, () => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'))}
          {toolbarButton('Subrayado', <Underline className="size-4" />, () => editor.chain().focus().toggleUnderline().run(), editor.isActive('underline'))}
          <ToolbarDivider />
          {toolbarButton('Lista con viñetas', <List className="size-4" />, () => editor.chain().focus().toggleBulletList().run(), editor.isActive('bulletList'))}
          {toolbarButton('Lista numerada', <ListOrdered className="size-4" />, () => editor.chain().focus().toggleOrderedList().run(), editor.isActive('orderedList'))}
          <ToolbarDivider />
          {toolbarButton('Alinear a la izquierda', <AlignLeft className="size-4" />, () => editor.chain().focus().setTextAlign('left').run(), editor.isActive({ textAlign: 'left' }))}
          {toolbarButton('Centrar', <AlignCenter className="size-4" />, () => editor.chain().focus().setTextAlign('center').run(), editor.isActive({ textAlign: 'center' }))}
          {toolbarButton('Alinear a la derecha', <AlignRight className="size-4" />, () => editor.chain().focus().setTextAlign('right').run(), editor.isActive({ textAlign: 'right' }))}
          <ToolbarDivider />
          {toolbarButton('Insertar o editar enlace', <Link className="size-4" />, openLinkDialog, false)}
          {toolbarButton('Subir imagen', <ImageIcon className="size-4" />, openImageDialog, false)}
          <ToolbarDivider />
          {toolbarButton('Deshacer', <Undo2 className="size-4" />, () => editor.chain().focus().undo().run(), false, !editor.can().undo())}
          {toolbarButton('Rehacer', <Redo2 className="size-4" />, () => editor.chain().focus().redo().run(), false, !editor.can().redo())}
          {toolbarButton('Limpiar formato', <Eraser className="size-4" />, () => editor.chain().focus().unsetAllMarks().unsetTextAlign().run())}
          {toolbarButton(expanded ? 'Reducir editor' : 'Ampliar editor', expanded ? <X className="size-4" /> : <Maximize2 className="size-4" />, () => setExpanded((current) => !current))}
        </div>

        {linkDialog ? <LinkPanel value={linkDialog} existing={editor.isActive('link')} onChange={setLinkDialog} onCancel={() => setLinkDialog(null)} onInsert={insertLink} onRemove={removeLink} /> : null}
        {imageDialog ? <ImageUploadPanel value={imageDialog} uploading={uploading} inputRef={fileInputRef} onChange={setImageDialog} onCancel={() => setImageDialog(null)} onInsert={() => void insertImage()} /> : <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => { const file = event.target.files?.[0] ?? null; setImageDialog({ file, alt: file?.name.replace(/\.[^.]+$/, '') ?? '', caption: '', error: '', replacing: false }); event.target.value = '' }} />}

        {selectedImage ? <ImageControls editor={editor} onUpdate={updateImage} onReplace={openReplaceImageDialog} /> : null}

        <EditorContent editor={editor} className={cn("activity-rich-editor min-h-0 overflow-y-auto [&_.ProseMirror_a]:text-primary [&_.ProseMirror_a]:underline [&_.ProseMirror_blockquote]:my-4 [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-blue-300 [&_.ProseMirror_blockquote]:bg-blue-50/50 [&_.ProseMirror_blockquote]:px-4 [&_.ProseMirror_blockquote]:py-3 [&_.ProseMirror_blockquote]:text-slate-700 [&_.ProseMirror_figcaption]:mt-2 [&_.ProseMirror_figcaption]:text-center [&_.ProseMirror_figcaption]:text-xs [&_.ProseMirror_figcaption]:text-muted-foreground [&_.ProseMirror_figure]:my-4 [&_.ProseMirror_figure]:w-full [&_.ProseMirror_figure.ProseMirror-selectednode]:rounded-xl [&_.ProseMirror_figure.ProseMirror-selectednode]:ring-2 [&_.ProseMirror_figure.ProseMirror-selectednode]:ring-violet-400 [&_.ProseMirror_figure[data-align='center']_img]:mx-auto [&_.ProseMirror_figure[data-align='right']_img]:ml-auto [&_.ProseMirror_figure[data-size='full']_img]:w-full [&_.ProseMirror_figure[data-size='large']_img]:w-3/4 [&_.ProseMirror_figure[data-size='medium']_img]:w-1/2 [&_.ProseMirror_figure[data-size='small']_img]:w-1/4 [&_.ProseMirror_h3]:my-2 [&_.ProseMirror_h3]:text-xl [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_img]:h-auto [&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:rounded-lg [&_.ProseMirror_li]:ml-5 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ul]:list-disc", expanded && 'flex-1')} />
        <div className="flex items-center justify-between gap-3 px-4 pb-2 text-xs font-medium"><span className={cn(nearingLimit ? 'text-amber-600' : 'text-muted-foreground')}>{characterCount >= DESCRIPTION_LIMIT ? 'Llegaste al límite. Elimina texto para continuar.' : nearingLimit ? 'Te estás acercando al límite de caracteres.' : ''}</span><span className={cn(nearingLimit ? 'font-black text-amber-600' : 'text-muted-foreground')}>{characterCount.toLocaleString()} / {DESCRIPTION_LIMIT.toLocaleString()} caracteres</span></div>
      </div>
    </div>
  )
}

function ToolbarDivider() { return <span className="mx-1 h-6 w-px bg-border" /> }

function LinkPanel({ value, existing, onChange, onCancel, onInsert, onRemove }: { value: NonNullable<LinkDialog>; existing: boolean; onChange: (value: NonNullable<LinkDialog>) => void; onCancel: () => void; onInsert: () => void; onRemove: () => void }) {
  return <div className="space-y-2 border-b border-blue-100 bg-blue-50/40 p-3"><div className="grid gap-2 sm:grid-cols-2"><label className="text-xs font-black text-blue-800">Texto visible<Input className="mt-1 h-9 bg-card" value={value.text} placeholder="Video sobre el ciclo del agua" onChange={(event) => onChange({ ...value, text: event.target.value, error: '' })} /></label><label className="text-xs font-black text-blue-800">Dirección web<Input className="mt-1 h-9 bg-card" value={value.url} placeholder="https://www.youtube.com/..." onChange={(event) => onChange({ ...value, url: event.target.value, error: '' })} /></label></div>{value.error ? <p className="text-xs font-bold text-destructive">{value.error}</p> : null}<div className="flex justify-end gap-2">{existing ? <Button type="button" size="sm" variant="ghost" className="text-destructive" onClick={onRemove}>Eliminar enlace</Button> : null}<Button type="button" size="sm" variant="ghost" onClick={onCancel}>Cancelar</Button><Button type="button" size="sm" onClick={onInsert}>{existing ? 'Guardar enlace' : 'Insertar enlace'}</Button></div></div>
}

function ImageUploadPanel({ value, uploading, inputRef, onChange, onCancel, onInsert }: { value: NonNullable<ImageDialog>; uploading: boolean; inputRef: React.RefObject<HTMLInputElement | null>; onChange: (value: NonNullable<ImageDialog>) => void; onCancel: () => void; onInsert: () => void }) {
  return <div className="space-y-2 border-b border-violet-100 bg-violet-50/40 p-3"><div className="flex flex-wrap items-end gap-2"><Button type="button" size="sm" variant="secondary" onClick={() => inputRef.current?.click()}><ImageIcon className="mr-2 size-4" />{value.file ? 'Cambiar archivo' : 'Seleccionar imagen'}</Button><span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{value.file?.name ?? 'PNG, JPG, JPEG o WebP · máximo 5 MB'}</span></div><input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => { const file = event.target.files?.[0] ?? null; onChange({ ...value, file, alt: value.alt || file?.name.replace(/\.[^.]+$/, '') || '', error: '' }); event.target.value = '' }} /><div className="grid gap-2 sm:grid-cols-2"><label className="text-xs font-black text-violet-800">Texto alternativo<Input className="mt-1 h-9 bg-card" value={value.alt} placeholder="Describe brevemente la imagen" onChange={(event) => onChange({ ...value, alt: event.target.value })} /></label><label className="text-xs font-black text-violet-800">Pie de imagen (opcional)<Input className="mt-1 h-9 bg-card" value={value.caption} placeholder="Fuente o explicación" onChange={(event) => onChange({ ...value, caption: event.target.value })} /></label></div>{value.error ? <p className="text-xs font-bold text-destructive">{value.error}</p> : null}<div className="flex justify-end gap-2"><Button type="button" size="sm" variant="ghost" disabled={uploading} onClick={onCancel}>Cancelar</Button><Button type="button" size="sm" disabled={!value.file || uploading} onClick={onInsert}>{uploading ? 'Subiendo…' : value.replacing ? 'Reemplazar imagen' : 'Insertar imagen'}</Button></div></div>
}

function ImageControls({ editor, onUpdate, onReplace }: { editor: ReturnType<typeof useEditor>; onUpdate: (attrs: Record<string, string>) => void; onReplace: () => void }) {
  if (!editor) return null
  const attrs = editor.getAttributes('activityImage')
  return <div className="space-y-2 border-b border-violet-100 bg-violet-50/40 px-3 py-2"><div className="flex flex-wrap items-center gap-1"><span className="mr-2 text-xs font-black text-violet-800">Imagen seleccionada</span>{(['small', 'medium', 'large', 'full'] as const).map((size) => <button key={size} type="button" className={cn('rounded-md px-2 py-1 text-xs font-bold', attrs.size === size ? 'bg-violet-100 text-violet-800' : 'text-muted-foreground hover:bg-violet-50')} onClick={() => onUpdate({ size })}>{{ small: 'Pequeña', medium: 'Mediana', large: 'Grande', full: 'Ancho completo' }[size]}</button>)}<ToolbarDivider />{[['left', AlignLeft], ['center', AlignCenter], ['right', AlignRight]].map(([align, Icon]) => <button key={String(align)} type="button" aria-label={`Alinear imagen ${align}`} className={cn('grid size-8 place-items-center rounded-md', attrs.align === align ? 'bg-violet-100 text-violet-800' : 'text-muted-foreground hover:bg-violet-50')} onClick={() => onUpdate({ align: String(align) })}><Icon className="size-4" /></button>)}<ToolbarDivider /><Button type="button" size="sm" variant="ghost" onClick={onReplace}><Expand className="mr-1 size-4" />Reemplazar</Button><Button type="button" size="sm" variant="ghost" className="text-destructive" onClick={() => editor.chain().focus().deleteSelection().run()}><Trash2 className="mr-1 size-4" />Eliminar</Button></div><div className="grid gap-2 sm:grid-cols-2"><label className="text-xs font-bold text-violet-800">Texto alternativo<Input className="mt-1 h-8 bg-card" value={attrs.alt ?? ''} onChange={(event) => onUpdate({ alt: event.target.value })} /></label><label className="text-xs font-bold text-violet-800">Pie de imagen<Input className="mt-1 h-8 bg-card" value={attrs.caption ?? ''} onChange={(event) => onUpdate({ caption: event.target.value })} /></label></div></div>
}

function selectionFontSize(editor: NonNullable<ReturnType<typeof useEditor>>) {
  const { from, to, empty } = editor.state.selection
  if (empty) return (editor.getAttributes('textStyle').fontSize as string | undefined)?.replace('px', '') ?? '14'
  const sizes = new Set<string>()
  editor.state.doc.nodesBetween(from, to, (node) => {
    if (!node.isText) return
    const mark = node.marks.find((item) => item.type.name === 'textStyle')
    sizes.add(String(mark?.attrs.fontSize ?? '14').replace('px', ''))
  })
  return sizes.size > 1 ? 'mixed' : [...sizes][0] ?? '14'
}

function normalizeInitialContent(value: string) {
  if (!value) return '<p></p>'
  if (/<\/?[a-z][\s\S]*>/i.test(value)) return value
  return `<p>${value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</p>`
}

function normalizeUrl(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ''
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try { const url = new URL(candidate); return ['http:', 'https:'].includes(url.protocol) ? url.toString() : '' } catch { return '' }
}
