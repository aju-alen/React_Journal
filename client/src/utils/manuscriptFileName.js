const MIME_EXT = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
}

const SLOT_FIELD = {
  0: 'coverLetter',
  1: 'manuscript',
  2: 'supplementary',
}

const SLOT_BASE = {
  0: 'cover_letter',
  2: 'supplementary',
}

export function manuscriptExtension(file) {
  if (file?.type && MIME_EXT[file.type]) return MIME_EXT[file.type]
  const match = String(file?.name || '').toLowerCase().match(/\.(docx|pdf|doc)$/)
  return match ? match[1] : null
}

export function canonicalSlotName(file, slotId, stage) {
  const ext = manuscriptExtension(file)
  if (!ext) return null
  const base = slotId === 1
    ? (stage === 'edit' ? 'in_edit' : 'in_review')
    : SLOT_BASE[slotId]
  if (!base) return null
  return `${base}.${ext}`
}

export function slotFieldName(slotId) {
  return SLOT_FIELD[slotId] || null
}
