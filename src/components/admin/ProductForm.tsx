'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AlertTriangle, Package, Upload, X } from 'lucide-react'
import type { Product, ProductCategory } from '@/types'

export interface ProductFormValues {
  name: string
  shortDescription: string
  description: string
  price: string
  stock: string
  categoryId: string
  brand: string
  ingredients: string
  usage: string
  isActive: boolean
  isFeatured: boolean
}

const EMPTY: ProductFormValues = {
  name: '',
  shortDescription: '',
  description: '',
  price: '',
  stock: '',
  categoryId: '',
  brand: '',
  ingredients: '',
  usage: '',
  isActive: true,
  isFeatured: false,
}

export function ProductForm({
  initial,
  categories,
  onSubmit,
  submitLabel,
  onCancel,
  submitting,
  errorMessage,
}: {
  initial: Product | null
  categories: ProductCategory[]
  onSubmit: (formData: FormData) => void
  submitLabel: string
  onCancel: () => void
  submitting: boolean
  errorMessage?: string
}) {
  const [values, setValues] = useState<ProductFormValues>(() =>
    initial
      ? {
          name: initial.name,
          shortDescription: initial.shortDescription ?? '',
          description: initial.description ?? '',
          price: initial.price.toString(),
          stock: initial.stock.toString(),
          categoryId: initial.categoryId,
          brand: initial.brand ?? '',
          ingredients: '',
          usage: '',
          isActive: initial.isActive,
          isFeatured: initial.isFeatured,
        }
      : EMPTY
  )
  const [newImages, setNewImages] = useState<File[]>([])
  const existingImages = initial?.images ?? []

  const handleField =
    (field: keyof ProductFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setValues((prev) => ({ ...prev, [field]: e.target.value }))

  const handleCheckbox = (field: keyof ProductFormValues) => () =>
    setValues((prev) => ({ ...prev, [field]: !prev[field] }))

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setNewImages(Array.from(e.target.files))
  }

  const removeNewImage = (idx: number) =>
    setNewImages((prev) => prev.filter((_, i) => i !== idx))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!values.name.trim() || !values.categoryId || !values.price || !values.stock) {
      return
    }
    const formData = new FormData()
    formData.append('name', values.name.trim())
    if (values.shortDescription) formData.append('shortDescription', values.shortDescription.trim())
    if (values.description) formData.append('description', values.description.trim())
    formData.append('price', values.price)
    formData.append('stock', values.stock)
    formData.append('categoryId', values.categoryId)
    if (values.brand) formData.append('brand', values.brand.trim())
    if (values.ingredients) formData.append('ingredients', values.ingredients.trim())
    if (values.usage) formData.append('usage', values.usage.trim())
    formData.append('isActive', String(values.isActive))
    formData.append('isFeatured', String(values.isFeatured))
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
        <Section title="Información básica">
          <Field label="Nombre *">
            <input
              required
              value={values.name}
              onChange={handleField('name')}
              className={inputCls}
              style={inputStyle}
              placeholder="Aceite esencial de lavanda"
            />
          </Field>
          <Field label="Categoría *">
            <select
              required
              value={values.categoryId}
              onChange={handleField('categoryId')}
              className={inputCls}
              style={inputStyle}
            >
              <option value="">Selecciona una categoría...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Marca">
            <input
              value={values.brand}
              onChange={handleField('brand')}
              className={inputCls}
              style={inputStyle}
              placeholder="Ej. Naturopath"
            />
          </Field>
          <Field label="Descripción corta">
            <textarea
              rows={2}
              value={values.shortDescription}
              onChange={handleField('shortDescription')}
              className={`${inputCls} resize-none`}
              style={inputStyle}
              placeholder="Aparece en la cuadrícula de la tienda"
            />
          </Field>
          <Field label="Descripción larga">
            <textarea
              rows={5}
              value={values.description}
              onChange={handleField('description')}
              className={`${inputCls} resize-none`}
              style={inputStyle}
              placeholder="Aparece en la página de detalle"
            />
          </Field>
        </Section>

        <Section title="Precio · stock · estado">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Precio (€) *">
              <input
                required
                type="number"
                min={0}
                step="0.01"
                value={values.price}
                onChange={handleField('price')}
                className={inputCls}
                style={inputStyle}
                placeholder="14,90"
              />
            </Field>
            <Field label="Stock *">
              <input
                required
                type="number"
                min={0}
                step="1"
                value={values.stock}
                onChange={handleField('stock')}
                className={inputCls}
                style={inputStyle}
                placeholder="25"
              />
            </Field>
          </div>

          <Field label="Ingredientes / composición">
            <textarea
              rows={3}
              value={values.ingredients}
              onChange={handleField('ingredients')}
              className={`${inputCls} resize-none`}
              style={inputStyle}
              placeholder="Lista de ingredientes activos"
            />
          </Field>
          <Field label="Modo de uso">
            <textarea
              rows={3}
              value={values.usage}
              onChange={handleField('usage')}
              className={`${inputCls} resize-none`}
              style={inputStyle}
              placeholder="Indicaciones de uso, dosificación..."
            />
          </Field>

          <div className="space-y-3 mt-2">
            <Toggle
              label="Activo"
              description="Visible en la tienda pública"
              checked={values.isActive}
              onChange={handleCheckbox('isActive')}
            />
            <Toggle
              label="Destacado"
              description="Aparece en la home en productos seleccionados"
              checked={values.isFeatured}
              onChange={handleCheckbox('isFeatured')}
            />
          </div>
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
                    alt="Imagen del producto"
                    fill
                    className="object-contain p-2"
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
                  Al guardar, las imágenes actuales se <strong>reemplazarán</strong>{' '}
                  por las nuevas que has seleccionado.
                </span>
              </div>
            )}
          </div>
        )}

        {/* Drop area */}
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
        <Package
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

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="w-full flex items-start justify-between gap-3 p-3 transition-colors"
      style={{
        background: checked ? 'oklch(0.668 0.063 64 / 0.08)' : 'oklch(0.96 0.005 90)',
        border: checked
          ? '1px solid oklch(0.668 0.063 64 / 0.4)'
          : '1px solid oklch(0.656 0.016 78 / 0.2)',
      }}
    >
      <div className="text-left">
        <p
          className="text-sm font-medium"
          style={{ color: 'oklch(0.21 0 0)' }}
        >
          {label}
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'oklch(0.45 0 0)' }}>
          {description}
        </p>
      </div>
      <div
        className="flex-shrink-0 w-9 h-5 relative transition-colors"
        style={{
          background: checked ? 'oklch(0.551 0.041 147)' : 'oklch(0.656 0.016 78 / 0.3)',
        }}
      >
        <span
          className="absolute top-0.5 w-4 h-4 transition-all duration-200"
          style={{
            background: 'oklch(0.99 0.004 90)',
            left: checked ? 'calc(100% - 1.125rem)' : '0.125rem',
          }}
        />
      </div>
    </button>
  )
}

function FilePreview({ file }: { file: File }) {
  const url = URL.createObjectURL(file)
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={file.name}
      className="absolute inset-0 w-full h-full object-contain p-2"
      onLoad={() => URL.revokeObjectURL(url)}
    />
  )
}
