'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Calendar, Clock, MapPin, Plus, Trash2, Users } from 'lucide-react'
import { classesApi } from '@/lib/api'
import type { ClassSchedule } from '@/types'

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export function ScheduleManager({
  classId,
  schedules,
}: {
  classId: string
  schedules: ClassSchedule[]
}) {
  const [draft, setDraft] = useState({
    dayOfWeek: '1',
    startTime: '',
    endTime: '',
    maxStudents: '15',
    location: '',
  })
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-classes'] })
    queryClient.invalidateQueries({ queryKey: ['admin-class', classId] })
    queryClient.invalidateQueries({ queryKey: ['class', classId] })
  }

  const add = useMutation({
    mutationFn: () =>
      classesApi.addSchedule(classId, {
        dayOfWeek: parseInt(draft.dayOfWeek, 10),
        startTime: draft.startTime,
        endTime: draft.endTime,
        maxStudents: parseInt(draft.maxStudents, 10),
        location: draft.location.trim() || undefined,
      }),
    onSuccess: () => {
      setDraft({
        dayOfWeek: '1',
        startTime: '',
        endTime: '',
        maxStudents: '15',
        location: '',
      })
      invalidate()
    },
  })

  const remove = useMutation({
    mutationFn: (scheduleId: string) =>
      classesApi.deleteSchedule(classId, scheduleId),
    onSuccess: invalidate,
  })

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft.startTime || !draft.endTime) return
    add.mutate()
  }

  return (
    <section
      className="p-6"
      style={{
        background: 'oklch(0.99 0.004 90)',
        border: '1px solid oklch(0.656 0.016 78 / 0.18)',
      }}
    >
      <h2
        className="text-base mb-1 flex items-center gap-3"
        style={{
          fontFamily: 'var(--font-playfair), serif',
          color: 'oklch(0.21 0 0)',
        }}
      >
        <Calendar
          className="w-4 h-4"
          style={{ color: 'oklch(0.668 0.063 64)' }}
        />
        Horarios
      </h2>
      <p className="text-xs mb-5" style={{ color: 'oklch(0.656 0.016 78)' }}>
        Estos son los días y franjas en que se imparte la clase.
      </p>

      {(add.isError || remove.isError) && (
        <div
          className="p-3 mb-4 text-sm"
          style={{
            background: 'oklch(0.96 0.05 25)',
            border: '1px solid oklch(0.6 0.18 25 / 0.4)',
            color: 'oklch(0.4 0.18 25)',
          }}
        >
          {(add.error || remove.error) instanceof Error
            ? (add.error as Error)?.message ?? (remove.error as Error)?.message
            : 'Error al gestionar horarios'}
        </div>
      )}

      {/* Existing schedules */}
      {schedules.length > 0 ? (
        <ul
          className="divide-y mb-6"
          style={{ borderColor: 'oklch(0.656 0.016 78 / 0.15)' }}
        >
          {[...schedules]
            .sort((a, b) =>
              a.dayOfWeek === b.dayOfWeek
                ? a.startTime.localeCompare(b.startTime)
                : a.dayOfWeek - b.dayOfWeek
            )
            .map((s) => (
              <li
                key={s.id}
                className="flex flex-wrap items-center gap-x-5 gap-y-2 py-3"
              >
                <span
                  className="text-sm font-medium w-24"
                  style={{
                    fontFamily: 'var(--font-playfair), serif',
                    color: 'oklch(0.21 0 0)',
                  }}
                >
                  {DAYS[s.dayOfWeek]}
                </span>
                <span
                  className="flex items-center gap-1.5 text-sm tabular-nums"
                  style={{ color: 'oklch(0.45 0 0)' }}
                >
                  <Clock className="w-3.5 h-3.5" />
                  {s.startTime} — {s.endTime}
                </span>
                <span
                  className="flex items-center gap-1.5 text-xs"
                  style={{ color: 'oklch(0.656 0.016 78)' }}
                >
                  <Users className="w-3 h-3" />
                  Máx. {s.maxStudents}
                </span>
                {s.location && (
                  <span
                    className="flex items-center gap-1.5 text-xs"
                    style={{ color: 'oklch(0.656 0.016 78)' }}
                  >
                    <MapPin className="w-3 h-3" />
                    {s.location}
                  </span>
                )}
                <button
                  onClick={() => {
                    if (confirm('¿Eliminar este horario?')) {
                      remove.mutate(s.id)
                    }
                  }}
                  disabled={remove.isPending}
                  className="ml-auto inline-flex items-center justify-center w-8 h-8 transition-colors disabled:opacity-60"
                  style={{
                    color: 'oklch(0.55 0.18 25)',
                    border: '1px solid oklch(0.55 0.18 25 / 0.4)',
                  }}
                  aria-label="Eliminar horario"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
        </ul>
      ) : (
        <p
          className="text-xs italic mb-6"
          style={{ color: 'oklch(0.656 0.016 78)' }}
        >
          Aún no hay horarios. Añade el primero abajo.
        </p>
      )}

      {/* Add form */}
      <form
        onSubmit={handleAdd}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] gap-3 items-end pt-5 border-t"
        style={{ borderColor: 'oklch(0.656 0.016 78 / 0.15)' }}
      >
        <FormCell label="Día">
          <select
            value={draft.dayOfWeek}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, dayOfWeek: e.target.value }))
            }
            className={inputCls}
            style={inputStyle}
          >
            {DAYS.map((label, idx) => (
              <option key={idx} value={idx}>
                {label}
              </option>
            ))}
          </select>
        </FormCell>
        <FormCell label="Inicio *">
          <input
            type="time"
            required
            value={draft.startTime}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, startTime: e.target.value }))
            }
            className={inputCls}
            style={inputStyle}
          />
        </FormCell>
        <FormCell label="Fin *">
          <input
            type="time"
            required
            value={draft.endTime}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, endTime: e.target.value }))
            }
            className={inputCls}
            style={inputStyle}
          />
        </FormCell>
        <FormCell label="Plazas">
          <input
            type="number"
            min={1}
            max={100}
            value={draft.maxStudents}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, maxStudents: e.target.value }))
            }
            className={inputCls}
            style={inputStyle}
          />
        </FormCell>
        <FormCell label="Sala">
          <input
            value={draft.location}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, location: e.target.value }))
            }
            placeholder="Sala 1 (opcional)"
            className={inputCls}
            style={inputStyle}
          />
        </FormCell>
        <button
          type="submit"
          disabled={add.isPending || !draft.startTime || !draft.endTime}
          className="inline-flex items-center justify-center gap-1.5 h-[38px] px-4 text-xs tracking-wide uppercase transition-colors disabled:opacity-60"
          style={{
            background: 'oklch(0.21 0 0)',
            color: 'oklch(0.979 0.004 90)',
          }}
        >
          <Plus className="w-3.5 h-3.5" />
          {add.isPending ? 'Añadiendo...' : 'Añadir'}
        </button>
      </form>
    </section>
  )
}

const inputCls =
  'w-full px-3 py-2 text-sm focus:outline-none transition-colors'

const inputStyle = {
  background: 'oklch(0.96 0.005 90)',
  border: '1px solid oklch(0.656 0.016 78 / 0.25)',
  color: 'oklch(0.21 0 0)',
} as const

function FormCell({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span
        className="block text-[10px] tracking-wide uppercase mb-1.5"
        style={{ color: 'oklch(0.45 0 0)' }}
      >
        {label}
      </span>
      {children}
    </label>
  )
}
