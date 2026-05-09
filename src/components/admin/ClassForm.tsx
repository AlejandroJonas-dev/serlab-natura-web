'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AlertTriangle, GraduationCap, Plus, Upload, X } from 'lucide-react'
import type { GroupClass } from '@/types'

export interface ClassFormValues {
  name: string
  shortDescription: string
  description: string
  pricePerSession: string
  priceMonthly: string
  isActive: boolean
}

const EMPTY: ClassFormValues = {
  name: '',
  shortDescription: '',
  description: '',
  pricePerSession: '',
  priceMonthly: '',
  isActive: true,
}

export function ClassForm({
  initial,
  onSubmit,
  submitLabel,
  onCancel,
  submitting,
  errorMessage,
  showActiveToggle = false,
}: {
  initial: GroupClass | null
  onSubmit: (formData: FormData) => void
  submitLabel: string
  onCancel: () => void
  submitting: boolean
  errorMessage?: string
  /** El controller de creación no acepta isActive, solo update */
  showActiveToggle?: boolean
}) {
  const [values, setValues] = useState<ClassFormValues>(() =>
    initial
      ? {
          name: initial.name,
          shortDescription: initial.shortDescription ?? '',
          description: initial.description ?? '',
          pricePerSession: initial.pricePerSession.toString(),
          priceMonthly: initial.priceMonthly?.toString() ?? '',
          isActive: initial.isActive,
        }
      : EMPTY
  )
  const [benefits, setBenefits] = useState<string[]>(() => initial?.benefits ?? [])
  const [benefitDraft, setBenefitDraft] = useState('')
  const [newImages, setNewImages] = useState<File[]>([])
  const existingImages = initial?.images ?? []

  const handleField =
    (field: keyof ClassFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((prev) => ({ ...prev, [field]: e.target.value }))

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setNewImages(Array.from(e.target.files))
  }

  const removeNewImage = (idx: number) =>
    setNewImages((prev) => prev.filter((_, i) => i !== idx))

  const addBenefit = () => {
    const trimmed = benefitDraft.trim()
    if (!trimmed || benefits.includes(trimmed)) return
    setBenefits((prev) => [...prev, trimmed])
    setBenefitDraft('')
  }

  const removeBenefit = (idx: number) =>
    setBenefits((prev) => prev.filter((_, i) => i !== idx))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!values.name.trim() || !values.pricePerSession || !values.description.trim()) {
      return
    }
    const formData = new FormData()
    formData.append('name', values.name.trim())
    formData.append('description', values.description.trim())
    if (values.shortDescription) formData.append('shortDescription', values.shortDescription.trim())
    formData.append('pricePerSession', values.pricePerSession)
    if (values.priceMonthly) formData.append('priceMonthly', values.priceMonthly)
    benefits.forEach((b) => formData.append('benefits', b))
    if (showActiveToggle) formData.append('isActive', String(values.isActive))
    newImages.forEach((file) => formData.append('images', file))
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {errorMessage && (
        <div
          className="p-3 text-sm"
          style={{
            background: 'oklch(0.96 0.05 25)',
            border: '1px solid oklch(0.6 0.18 25 / 0.4)',
            color: 'oklch(0.4 0.18 25)',
          }}
        >
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Información de la clase">
          <Field label="Nombre *">
            <input
              required
              value={values.name}
              onChange={handleField('name')}
              className={inputCls}
              style={inputStyle}
              placeholder="Pilates Reformer"
            />
          </Field>
          <Field label="Descripción corta">
            <textarea
              rows={2}
              value={values.shortDescription}
              onChange={handleField('shortDescription')}
              className={`${inputCls} resize-none`}
              style={inputStyle}
              placeholder="Aparece en la cuadrícula de clases"
            />
          </Field>
          <Field label="Descripción larga *">
            <textarea
              required
              rows={6}
              value={values.description}
              onChange={handleField('description')}
              className={`${inputCls} resize-none`}
              style={inputStyle}
              placeholder="Beneficios, metodología, público objetivo..."
            />
          </Field>
          {showActiveToggle && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() =>
                  setValues((prev) => ({ ...prev, isActive: !prev.isActive }))
                }
                className="w-full flex items-start justify-between gap-3 p-3 transition-colors"
                style={{
                  background: values.isActive
                    ? 'oklch(0.668 0.063 64 / 0.08)'
                    : 'oklch(0.96 0.005 90)',
                  border: values.isActive
                    ? '1px solid oklch(0.668 0.063 64 / 0.4)'
                    : '1px solid oklch(0.656 0.016 78 / 0.2)',
                }}
              >
                <div className="text-left">
                  <p
                    className="text-sm font-medium"
                    style={{ color: 'oklch(0.21 0 0)' }}
                  >
                    Clase activa
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: 'oklch(0.45 0 0)' }}
                  >
                    Visible en /clases y abierta a inscripciones
                  </p>
                </div>
                <div
                  className="flex-shrink-0 w-9 h-5 relative transition-colors"
                  style={{
                    background: values.isActive
                      ? 'oklch(0.551 0.041 147)'
                      : 'oklch(0.656 0.016 78 / 0.3)',
                  }}
                >
                  <span
                    className="absolute top-0.5 w-4 h-4 transition-all duration-200"
                    style={{
                      background: 'oklch(0.99 0.004 90)',
                      left: values.isActive
                        ? 'calc(100% - 1.125rem)'
                        : '0.125rem',
                    }}
                  />
                </div>
              </button>
            </div>
          )}
        </Section>

        <Section title="Precios y beneficios">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Sesión suelta (€) *">
              <input
                required
                type="number"
                min={0}
                step="0.01"
                value={values.pricePerSession}
                onChange={handleField('pricePerSession')}
                className={inputCls}
                style={inputStyle}
                placeholder="15"
              />
            </Field>
            <Field label="Bono mensual (€)">
              <input
                type="number"
                min={0}
                step="0.01"
                value={values.priceMonthly}
                onChange={handleField('priceMonthly')}
                className={inputCls}
                style={inputStyle}
                placeholder="50 (opcional)"
              />
            </Field>
          </div>

          <Field label="Beneficios">
            <div
              className="flex flex-wrap gap-2 p-3 mb-3 min-h-[60px]"
              style={{
                background: 'oklch(0.96 0.005 90)',
                border: '1px solid oklch(0.656 0.016 78 / 0.2)',
              }}
            >
              {benefits.length === 0 ? (
                <span
                  className="text-xs italic"
                  style={{ color: 'oklch(0.656 0.016 78)' }}
                >
                  Aún no hay beneficios
                </span>
              ) : (
                benefits.map((b, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-xs"
                    style={{
                      background: 'oklch(0.99 0.004 90)',
                      color: 'oklch(0.21 0 0)',
                      border: '1px solid oklch(0.668 0.063 64 / 0.3)',
                    }}
                  >
                    {b}
                    <button
                      type="button"
                      onClick={() => removeBenefit(idx)}
                      className="transition-colors hover:text-[oklch(0.55_0.18_25)]"
                      style={{ color: 'oklch(0.656 0.016 78)' }}
                      aria-label="Quitar"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <input
                value={benefitDraft}
                onChange={(e) => setBenefitDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addBenefit()
                  }
                }}
                placeholder="Ej. Mejora la postura"
                className={inputCls}
                style={inputStyle}
              />
              <button
                type="button"
                onClick={addBenefit}
                className="inline-flex items-center gap-1 px-4 py-2 text-xs tracking-wide uppercase transition-colors"
                style={{
                  background: 'oklch(0.21 0 0)',
                  color: 'oklch(0.979 0.004 90)',
                }}
              >
                <Plus className="w-3.5 h-3.5" /> Añadir
              </button>
            </div>
          </Field>
        </Section>
      </div>

      {/* Images */}
      <Section title="Imágenes">
        {existingImages.length > 0 && (
          <div>
            <p
              className="text-[11px] tracking-wide uppercase mb-3"
              style={{ color: 'oklch(0.45 0 0)' }}
            >
              Imágenes actuales ({existingImages.length})
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
              {existingImages.map((url) => (
                <div
                  key={url}
                  className="relative aspect-square overflow-hidden"
                  style={{
                    background: 'oklch(0.96 0.005 90)',
                    border: '1px solid oklch(0.656 0.016 78 / 0.18)',
                  }}
                >
                  <Image
                    src={url}
                    alt="Imagen de la clase"
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                </div>
              ))}
            </div>
            {newImages.length > 0 && (
              <div
                className="flex items-start gap-2 p-3 mb-3 text-xs"
                style={{
                  background: 'oklch(0.97 0.04 85)',
                  border: '1px solid oklch(0.668 0.063 64 / 0.4)',
                  color: 'oklch(0.4 0.05 70)',
                }}
              >
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  Al guardar, las imágenes actuales se{' '}
                  <strong>reemplazarán</strong> por las nuevas.
                </span>
              </div>
            )}
          </div>
        )}

        <label
          className="flex flex-col items-center justify-center gap-2 p-8 cursor-pointer transition-colors"
          style={{
            background: 'oklch(0.96 0.005 90)',
            border: '1px dashed oklch(0.656 0.016 78 / 0.4)',
          }}
        >
          <Upload className="w-5 h-5" style={{ color: 'oklch(0.668 0.063 64)' }} />
          <span className="text-sm" style={{ color: 'oklch(0.21 0 0)' }}>
            {existingImages.length > 0
              ? 'Subir imágenes nuevas (sustituirán las actuales)'
              : 'Subir imágenes'}
          </span>
          <span className="text-xs" style={{ color: 'oklch(0.656 0.016 78)' }}>
            JPG, PNG o WebP · puedes seleccionar varias
          </span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFiles}
            className="hidden"
          />
        </label>

        {newImages.length > 0 && (
          <div className="mt-4">
            <p
              className="text-[11px] tracking-wide uppercase mb-3"
              style={{ color: 'oklch(0.45 0 0)' }}
            >
              Nuevas imágenes ({newImages.length})
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {newImages.map((file, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square group overflow-hidden"
                  style={{
                    background: 'oklch(0.96 0.005 90)',
                    border: '1px solid oklch(0.668 0.063 64 / 0.5)',
                  }}
                >
                  <FilePreview file={file} />
                  <button
                    type="button"
                    onClick={() => removeNewImage(idx)}
                    className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100"
                    style={{
                      background: 'oklch(0.21 0 0)',
                      color: 'oklch(0.979 0.004 90)',
                    }}
                    aria-label="Quitar"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Section>

      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 pt-6 border-t"
        style={{ borderColor: 'oklch(0.656 0.016 78 / 0.18)' }}
      >
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-6 py-2.5 text-xs tracking-wide uppercase transition-colors disabled:opacity-60"
          style={{
            background: 'oklch(0.99 0.004 90)',
            color: 'oklch(0.45 0 0)',
            border: '1px solid oklch(0.656 0.016 78 / 0.25)',
          }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 text-xs tracking-wide uppercase transition-colors disabled:opacity-60"
          style={{
            background: 'oklch(0.21 0 0)',
            color: 'oklch(0.979 0.004 90)',
          }}
        >
          {submitting ? 'Guardando...' : submitLabel}
        </button>
      </div>
    </form>
  )
}

const inputCls =
  'w-full px-4 py-2.5 text-sm focus:outline-none transition-colors'

const inputStyle = {
  background: 'oklch(0.99 0.004 90)',
  border: '1px solid oklch(0.656 0.016 78 / 0.25)',
  color: 'oklch(0.21 0 0)',
} as const

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section
      className="p-6"
      style={{
        background: 'oklch(0.99 0.004 90)',
        border: '1px solid oklch(0.656 0.016 78 / 0.18)',
      }}
    >
      <h2
        className="text-base mb-5 flex items-center gap-3"
        style={{
          fontFamily: 'var(--font-playfair), serif',
          color: 'oklch(0.21 0 0)',
        }}
      >
        <GraduationCap
          className="w-4 h-4"
          style={{ color: 'oklch(0.668 0.063 64)' }}
        />
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        className="block text-xs tracking-wide uppercase mb-2"
        style={{ color: 'oklch(0.45 0 0)' }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

function FilePreview({ file }: { file: File }) {
  const url = URL.createObjectURL(file)
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={file.name}
      className="absolute inset-0 w-full h-full object-cover"
      onLoad={() => URL.revokeObjectURL(url)}
    />
  )
}
