'use client'

import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ChevronDown,
  ChevronRight,
  Edit2,
  FolderTree,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import { productCategoriesApi } from '@/lib/api'
import type { ProductCategory, ProductCategoryNode } from '@/types'

interface FormState {
  mode: 'create' | 'edit'
  name: string
  description: string
  parentId: string | null
  isActive: boolean
  /** Solo en modo edit */
  id?: string
}

const EMPTY_FORM: FormState = {
  mode: 'create',
  name: '',
  description: '',
  parentId: null,
  isActive: true,
}

export default function AdminCategoriasPage() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<FormState | null>(null)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const treeQuery = useQuery({
    queryKey: ['admin-categories-tree'],
    queryFn: () =>
      productCategoriesApi
        .getAll({ tree: true, includeInactive: true, includeCount: true })
        .then((r) => r.data),
  })
  const flatQuery = useQuery({
    queryKey: ['admin-categories-flat'],
    queryFn: () =>
      productCategoriesApi
        .getAll({ includeInactive: true })
        .then((r) => r.data),
  })

  const tree = useMemo<ProductCategoryNode[]>(
    () => treeQuery.data?.data?.categories ?? [],
    [treeQuery.data],
  )
  const flat: ProductCategory[] = flatQuery.data?.data?.categories ?? []

  // Mapa id → path "Padre / Hijo / Nieto" para el selector
  const pathMap = useMemo(() => {
    const map = new Map<string, string>()
    const walk = (nodes: ProductCategoryNode[], parents: string[]) => {
      nodes.forEach((n) => {
        const path = [...parents, n.name].join(' / ')
        map.set(n.id, path)
        if (n.children && n.children.length > 0) walk(n.children, [...parents, n.name])
      })
    }
    walk(tree, [])
    return map
  }, [tree])

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-categories-tree'] })
    queryClient.invalidateQueries({ queryKey: ['admin-categories-flat'] })
    queryClient.invalidateQueries({ queryKey: ['product-categories'] })
  }

  const create = useMutation({
    mutationFn: (body: { name: string; description?: string; parentId?: string | null }) =>
      productCategoriesApi.create(body),
    onSuccess: () => {
      setForm(null)
      invalidate()
    },
  })

  const update = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string
      body: {
        name?: string
        description?: string | null
        parentId?: string | null
        isActive?: boolean
      }
    }) => productCategoriesApi.update(id, body),
    onSuccess: () => {
      setForm(null)
      invalidate()
    },
  })

  const remove = useMutation({
    mutationFn: (id: string) => productCategoriesApi.delete(id),
    onSuccess: invalidate,
  })

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return
    if (!form.name.trim()) return

    if (form.mode === 'create') {
      create.mutate({
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        parentId: form.parentId,
      })
    } else if (form.id) {
      update.mutate({
        id: form.id,
        body: {
          name: form.name.trim(),
          description: form.description.trim() || null,
          parentId: form.parentId,
          isActive: form.isActive,
        },
      })
    }
  }

  return (
    <div className="max-w-[1100px] mx-auto">
      <header className="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="rule-cobre" />
            <span
              className="text-xs tracking-[0.25em] uppercase"
              style={{ color: 'oklch(0.668 0.063 64)' }}
            >
              Estructura del catálogo
            </span>
          </div>
          <h1
            className="text-3xl lg:text-4xl"
            style={{
              fontFamily: 'var(--font-playfair), serif',
              color: 'oklch(0.21 0 0)',
            }}
          >
            Categorías de productos
          </h1>
          <p
            className="text-xs mt-2 max-w-md"
            style={{ color: 'oklch(0.656 0.016 78)' }}
          >
            Las categorías pueden tener subcategorías. Los productos se asignan
            siempre a la categoría más específica.
          </p>
        </div>
        <button
          onClick={() => setForm({ ...EMPTY_FORM })}
          className="inline-flex items-center gap-2 px-5 py-3 text-xs tracking-wide uppercase transition-colors"
          style={{
            background: 'oklch(0.21 0 0)',
            color: 'oklch(0.979 0.004 90)',
          }}
        >
          <Plus className="w-4 h-4" /> Nueva categoría
        </button>
      </header>

      {(create.isError || update.isError || remove.isError) && (
        <div
          className="mb-4 p-3 text-sm"
          style={{
            background: 'oklch(0.96 0.05 25)',
            border: '1px solid oklch(0.6 0.18 25 / 0.4)',
            color: 'oklch(0.4 0.18 25)',
          }}
        >
          {(create.error || update.error || remove.error) instanceof Error
            ? (create.error as Error)?.message ??
              (update.error as Error)?.message ??
              (remove.error as Error)?.message
            : 'Error en la operación'}
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        {/* Tree */}
        <div
          className="p-2"
          style={{
            background: 'oklch(0.99 0.004 90)',
            border: '1px solid oklch(0.656 0.016 78 / 0.18)',
          }}
        >
          {treeQuery.isLoading ? (
            <div className="space-y-2 p-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-9 animate-pulse"
                  style={{ background: 'oklch(0.94 0.005 90)' }}
                />
              ))}
            </div>
          ) : tree.length === 0 ? (
            <div className="p-10 text-center">
              <FolderTree
                className="w-10 h-10 mx-auto mb-4"
                style={{ color: 'oklch(0.656 0.016 78 / 0.4)' }}
              />
              <p className="text-sm" style={{ color: 'oklch(0.45 0 0)' }}>
                Aún no hay categorías. Crea la primera.
              </p>
            </div>
          ) : (
            <TreeList
              nodes={tree}
              expanded={expanded}
              onToggle={toggle}
              onEdit={(node) =>
                setForm({
                  mode: 'edit',
                  id: node.id,
                  name: node.name,
                  description: node.description ?? '',
                  parentId: node.parentId ?? null,
                  isActive: node.isActive,
                })
              }
              onRemove={(node) => {
                if (
                  confirm(
                    `¿Desactivar la categoría "${node.name}"? Si tiene productos o subcategorías activas, no se podrá.`
                  )
                ) {
                  remove.mutate(node.id)
                }
              }}
              level={0}
            />
          )}
        </div>

        {/* Form panel */}
        {form && (
          <aside
            className="p-6 lg:sticky lg:top-20"
            style={{
              background: 'oklch(0.99 0.004 90)',
              border: '1px solid oklch(0.656 0.016 78 / 0.18)',
            }}
          >
            <header className="flex items-center justify-between mb-5">
              <h2
                className="text-base"
                style={{
                  fontFamily: 'var(--font-playfair), serif',
                  color: 'oklch(0.21 0 0)',
                }}
              >
                {form.mode === 'create' ? 'Nueva categoría' : 'Editar categoría'}
              </h2>
              <button
                onClick={() => setForm(null)}
                className="w-8 h-8 flex items-center justify-center"
                style={{ color: 'oklch(0.656 0.016 78)' }}
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Nombre *">
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className={inputCls}
                  style={inputStyle}
                  placeholder="Ej. Té e infusiones"
                />
              </Field>

              <Field label="Categoría padre">
                <select
                  value={form.parentId ?? ''}
                  onChange={(e) =>
                    setForm({ ...form, parentId: e.target.value || null })
                  }
                  className={inputCls}
                  style={inputStyle}
                >
                  <option value="">— Categoría raíz —</option>
                  {flat
                    .filter((c) => c.id !== form.id)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {pathMap.get(c.id) ?? c.name}
                      </option>
                    ))}
                </select>
                <p
                  className="text-[11px] mt-1.5"
                  style={{ color: 'oklch(0.656 0.016 78)' }}
                >
                  Las categorías raíz aparecen en el menú principal de la
                  tienda.
                </p>
              </Field>

              <Field label="Descripción">
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className={`${inputCls} resize-none`}
                  style={inputStyle}
                />
              </Field>

              {form.mode === 'edit' && (
                <button
                  type="button"
                  onClick={() =>
                    setForm({ ...form, isActive: !form.isActive })
                  }
                  className="w-full flex items-start justify-between gap-3 p-3 transition-colors"
                  style={{
                    background: form.isActive
                      ? 'oklch(0.668 0.063 64 / 0.08)'
                      : 'oklch(0.96 0.005 90)',
                    border: form.isActive
                      ? '1px solid oklch(0.668 0.063 64 / 0.4)'
                      : '1px solid oklch(0.656 0.016 78 / 0.2)',
                  }}
                >
                  <div className="text-left">
                    <p
                      className="text-sm font-medium"
                      style={{ color: 'oklch(0.21 0 0)' }}
                    >
                      Categoría activa
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: 'oklch(0.45 0 0)' }}
                    >
                      Visible en /tienda y disponible para asignar productos
                    </p>
                  </div>
                  <div
                    className="flex-shrink-0 w-9 h-5 relative transition-colors"
                    style={{
                      background: form.isActive
                        ? 'oklch(0.551 0.041 147)'
                        : 'oklch(0.656 0.016 78 / 0.3)',
                    }}
                  >
                    <span
                      className="absolute top-0.5 w-4 h-4 transition-all duration-200"
                      style={{
                        background: 'oklch(0.99 0.004 90)',
                        left: form.isActive
                          ? 'calc(100% - 1.125rem)'
                          : '0.125rem',
                      }}
                    />
                  </div>
                </button>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setForm(null)}
                  disabled={create.isPending || update.isPending}
                  className="flex-1 px-4 py-2.5 text-xs tracking-wide uppercase transition-colors disabled:opacity-60"
                  style={{
                    color: 'oklch(0.45 0 0)',
                    border: '1px solid oklch(0.656 0.016 78 / 0.25)',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={create.isPending || update.isPending}
                  className="flex-1 px-4 py-2.5 text-xs tracking-wide uppercase transition-colors disabled:opacity-60"
                  style={{
                    background: 'oklch(0.21 0 0)',
                    color: 'oklch(0.979 0.004 90)',
                  }}
                >
                  {create.isPending || update.isPending
                    ? 'Guardando...'
                    : form.mode === 'create'
                      ? 'Crear'
                      : 'Guardar'}
                </button>
              </div>
            </form>
          </aside>
        )}
      </div>
    </div>
  )
}

function TreeList({
  nodes,
  expanded,
  onToggle,
  onEdit,
  onRemove,
  level,
}: {
  nodes: ProductCategoryNode[]
  expanded: Set<string>
  onToggle: (id: string) => void
  onEdit: (node: ProductCategoryNode) => void
  onRemove: (node: ProductCategoryNode) => void
  level: number
}) {
  return (
    <ul>
      {nodes.map((node) => {
        const hasChildren = node.children && node.children.length > 0
        const isOpen = expanded.has(node.id)
        return (
          <li key={node.id}>
            <div
              className="flex items-center gap-2 group hover:bg-[oklch(0.96_0.005_90)] transition-colors"
              style={{ paddingLeft: `${level * 24 + 12}px` }}
            >
              <button
                onClick={() => hasChildren && onToggle(node.id)}
                className="w-5 h-5 flex-shrink-0 flex items-center justify-center"
                style={{
                  color: hasChildren ? 'oklch(0.668 0.063 64)' : 'transparent',
                }}
                aria-label={isOpen ? 'Cerrar' : 'Abrir'}
                disabled={!hasChildren}
              >
                {hasChildren && isOpen ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : hasChildren ? (
                  <ChevronRight className="w-3.5 h-3.5" />
                ) : null}
              </button>

              <div
                className="flex-1 flex items-center gap-2 py-2.5 min-w-0"
                style={{ opacity: node.isActive ? 1 : 0.55 }}
              >
                <span
                  className="text-sm truncate"
                  style={{
                    fontFamily:
                      level === 0 ? 'var(--font-playfair), serif' : undefined,
                    color: 'oklch(0.21 0 0)',
                  }}
                >
                  {node.name}
                </span>
                {!node.isActive && (
                  <span
                    className="text-[9px] tracking-wide uppercase px-1.5 py-0.5"
                    style={{
                      background: 'oklch(0.55 0.18 25 / 0.1)',
                      color: 'oklch(0.55 0.18 25)',
                    }}
                  >
                    Inactiva
                  </span>
                )}
                {typeof node.productCount === 'number' && node.productCount > 0 && (
                  <span
                    className="text-[10px] tabular-nums"
                    style={{ color: 'oklch(0.656 0.016 78)' }}
                  >
                    · {node.productCount} prod.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(node)}
                  className="w-7 h-7 flex items-center justify-center transition-colors hover:text-[oklch(0.668_0.063_64)]"
                  style={{ color: 'oklch(0.45 0 0)' }}
                  aria-label="Editar"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onRemove(node)}
                  className="w-7 h-7 flex items-center justify-center transition-colors hover:text-[oklch(0.55_0.18_25)]"
                  style={{ color: 'oklch(0.45 0 0)' }}
                  aria-label="Desactivar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {hasChildren && isOpen && (
              <TreeList
                nodes={node.children}
                expanded={expanded}
                onToggle={onToggle}
                onEdit={onEdit}
                onRemove={onRemove}
                level={level + 1}
              />
            )}
          </li>
        )
      })}
    </ul>
  )
}

const inputCls = 'w-full px-3 py-2 text-sm focus:outline-none transition-colors'

const inputStyle = {
  background: 'oklch(0.96 0.005 90)',
  border: '1px solid oklch(0.656 0.016 78 / 0.25)',
  color: 'oklch(0.21 0 0)',
} as const

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
        className="block text-xs tracking-wide uppercase mb-1.5"
        style={{ color: 'oklch(0.45 0 0)' }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}
