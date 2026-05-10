'use client'

import { useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Lock,
  Package,
  Smartphone,
  Truck,
  Wallet,
} from 'lucide-react'
import { ordersApi } from '@/lib/api'
import { useCartStore } from '@/stores/cart.store'
import { useAuthStore } from '@/stores/auth.store'
import type { PaymentMethod } from '@/types'

const FREE_SHIPPING_THRESHOLD = 50
const SHIPPING_COST = 4.99

const PAYMENT_OPTIONS: Array<{
  id: PaymentMethod
  label: string
  description: string
  Icon: typeof CreditCard
}> = [
  { id: 'CARD', label: 'Tarjeta', description: 'Visa, Mastercard, AMEX', Icon: CreditCard },
  { id: 'BIZUM', label: 'Bizum', description: 'Pago con tu móvil', Icon: Smartphone },
  { id: 'BANK_TRANSFER', label: 'Transferencia', description: 'Plazo: 24-48h', Icon: Wallet },
]

interface ShippingForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  notes: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { items, totalPrice, clearCart } = useCartStore()

  const subtotal = totalPrice()
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST
  const total = subtotal + shippingCost

  const [form, setForm] = useState<ShippingForm>(() => ({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'España',
    notes: '',
  }))
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CARD')
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingForm, string>>>({})

  // SSR-safe client check (avoids showing empty cart state during hydration)
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

  const createOrder = useMutation({
    mutationFn: () =>
      ordersApi.create({
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        shippingAddress: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          street: form.street,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          country: form.country,
        },
        paymentMethod,
        notes: form.notes || undefined,
      }),
    onSuccess: (res) => {
      const orderNumber = res.data?.data?.order?.orderNumber as string | undefined
      clearCart()
      router.replace(`/checkout/exito?numero=${encodeURIComponent(orderNumber ?? '')}`)
    },
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }))
  }

  const validate = (): boolean => {
    const next: Partial<Record<keyof ShippingForm, string>> = {}
    if (!form.firstName.trim()) next.firstName = 'Requerido'
    if (!form.lastName.trim()) next.lastName = 'Requerido'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Email no válido'
    if (!form.phone.trim()) next.phone = 'Requerido'
    if (!form.street.trim()) next.street = 'Requerido'
    if (!form.city.trim()) next.city = 'Requerido'
    if (!form.state.trim()) next.state = 'Requerido'
    if (!/^\d{5}$/.test(form.postalCode)) next.postalCode = 'CP de 5 dígitos'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    createOrder.mutate()
  }

  // Empty cart state — only after mount
  if (mounted && items.length === 0 && !createOrder.isPending && !createOrder.isSuccess) {
    return (
      <main
        className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center"
        style={{ background: 'oklch(0.979 0.004 90)' }}
      >
        <Package className="w-16 h-16 mb-6" style={{ color: 'oklch(0.656 0.016 78 / 0.4)' }} />
        <h1
          className="text-2xl mb-3"
          style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
        >
          No hay nada que pagar
        </h1>
        <p className="text-sm mb-8 max-w-xs leading-relaxed" style={{ color: 'oklch(0.45 0 0)' }}>
          Añade productos a tu carrito antes de proceder al pago.
        </p>
        <Link
          href="/tienda"
          className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium tracking-wide transition-all duration-300"
          style={{ background: 'oklch(0.21 0 0)', color: 'oklch(0.979 0.004 90)' }}
        >
          Ir a la tienda <ArrowRight className="w-4 h-4" />
        </Link>
      </main>
    )
  }

  const inputBase =
    'w-full px-4 py-3 text-sm focus:outline-none transition-colors disabled:opacity-60'
  const inputStyle = {
    background: 'oklch(0.962 0.005 90)',
    border: '1px solid oklch(0.656 0.016 78 / 0.25)',
    color: 'oklch(0.21 0 0)',
  } as const
  const inputErrorStyle = {
    background: 'oklch(0.962 0.005 90)',
    border: '1px solid oklch(0.6 0.18 25)',
    color: 'oklch(0.21 0 0)',
  } as const

  return (
    <main style={{ background: 'oklch(0.979 0.004 90)' }}>
      {/* Breadcrumb */}
      <div
        className="py-4 px-6 lg:px-8 border-b border-[oklch(0.656_0.016_78/0.1)]"
        style={{ background: 'oklch(0.962 0.005 90)' }}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-[oklch(0.656_0.016_78)]">
          <Link href="/" className="hover:text-[oklch(0.668_0.063_64)] transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/carrito" className="hover:text-[oklch(0.668_0.063_64)] transition-colors">
            Carrito
          </Link>
          <span>/</span>
          <span>Checkout</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-20">
        <div className="flex items-center gap-3 mb-3">
          <span className="rule-cobre" />
          <span className="text-xs tracking-[0.25em] uppercase text-[oklch(0.668_0.063_64)]">
            Finalizar compra
          </span>
        </div>
        <h1
          className="text-3xl lg:text-4xl mb-10"
          style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
        >
          Checkout
        </h1>

        {!isAuthenticated && (
          <div
            className="mb-10 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{
              background: 'oklch(0.962 0.005 90)',
              border: '1px solid oklch(0.668 0.063 64 / 0.3)',
            }}
          >
            <div>
              <p className="text-sm font-medium" style={{ color: 'oklch(0.21 0 0)' }}>
                ¿Tienes cuenta?
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'oklch(0.45 0 0)' }}>
                Accede para acumular puntos de fidelidad y guardar tus pedidos.
              </p>
            </div>
            <Link
              href="/auth/login?redirect=/checkout"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium tracking-wide transition-colors"
              style={{ background: 'oklch(0.21 0 0)', color: 'oklch(0.979 0.004 90)' }}
            >
              Iniciar sesión <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {createOrder.isError && (
          <div
            className="mb-8 p-4 text-sm"
            style={{
              background: 'oklch(0.96 0.05 25)',
              border: '1px solid oklch(0.6 0.18 25 / 0.4)',
              color: 'oklch(0.4 0.18 25)',
            }}
          >
            {(createOrder.error as Error)?.message ?? 'Error al procesar el pedido'}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid lg:grid-cols-[1fr_400px] gap-10 lg:gap-16 items-start">

            {/* LEFT — Forms */}
            <div className="space-y-12">

              {/* Contact info */}
              <section>
                <header className="flex items-baseline gap-4 mb-6">
                  <span
                    className="text-2xl"
                    style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.668 0.063 64)' }}
                  >
                    01
                  </span>
                  <h2
                    className="text-lg"
                    style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
                  >
                    Datos de contacto
                  </h2>
                </header>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Nombre *" error={errors.firstName}>
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      className={inputBase}
                      style={errors.firstName ? inputErrorStyle : inputStyle}
                      placeholder="Ana"
                    />
                  </Field>
                  <Field label="Apellidos *" error={errors.lastName}>
                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      className={inputBase}
                      style={errors.lastName ? inputErrorStyle : inputStyle}
                      placeholder="García López"
                    />
                  </Field>
                  <Field label="Email *" error={errors.email}>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className={inputBase}
                      style={errors.email ? inputErrorStyle : inputStyle}
                      placeholder="ana@email.es"
                    />
                  </Field>
                  <Field label="Teléfono *" error={errors.phone}>
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      className={inputBase}
                      style={errors.phone ? inputErrorStyle : inputStyle}
                      placeholder="600 000 000"
                    />
                  </Field>
                </div>
              </section>

              {/* Shipping address */}
              <section>
                <header className="flex items-baseline gap-4 mb-6">
                  <span
                    className="text-2xl"
                    style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.668 0.063 64)' }}
                  >
                    02
                  </span>
                  <h2
                    className="text-lg"
                    style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
                  >
                    Dirección de envío
                  </h2>
                </header>
                <div className="space-y-5">
                  <Field label="Calle, número, piso *" error={errors.street}>
                    <input
                      name="street"
                      value={form.street}
                      onChange={handleChange}
                      className={inputBase}
                      style={errors.street ? inputErrorStyle : inputStyle}
                      placeholder="Av. del Aceituno 12, 3ºB"
                    />
                  </Field>
                  <div className="grid sm:grid-cols-3 gap-5">
                    <Field label="Ciudad *" error={errors.city}>
                      <input
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        className={inputBase}
                        style={errors.city ? inputErrorStyle : inputStyle}
                        placeholder="Córdoba"
                      />
                    </Field>
                    <Field label="Provincia *" error={errors.state}>
                      <input
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        className={inputBase}
                        style={errors.state ? inputErrorStyle : inputStyle}
                        placeholder="Córdoba"
                      />
                    </Field>
                    <Field label="Código postal *" error={errors.postalCode}>
                      <input
                        name="postalCode"
                        value={form.postalCode}
                        onChange={handleChange}
                        inputMode="numeric"
                        maxLength={5}
                        className={inputBase}
                        style={errors.postalCode ? inputErrorStyle : inputStyle}
                        placeholder="14001"
                      />
                    </Field>
                  </div>
                  <Field label="País">
                    <input
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      disabled
                      className={inputBase}
                      style={inputStyle}
                    />
                  </Field>
                  <Field label="Notas para el pedido (opcional)">
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      rows={3}
                      className={`${inputBase} resize-none`}
                      style={inputStyle}
                      placeholder="Instrucciones de entrega, horario preferido..."
                    />
                  </Field>
                </div>
              </section>

              {/* Payment */}
              <section>
                <header className="flex items-baseline gap-4 mb-6">
                  <span
                    className="text-2xl"
                    style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.668 0.063 64)' }}
                  >
                    03
                  </span>
                  <h2
                    className="text-lg"
                    style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
                  >
                    Método de pago
                  </h2>
                </header>
                <div className="grid sm:grid-cols-3 gap-3">
                  {PAYMENT_OPTIONS.map(({ id, label, description, Icon }) => {
                    const selected = paymentMethod === id
                    return (
                      <button
                        type="button"
                        key={id}
                        onClick={() => setPaymentMethod(id)}
                        className="flex flex-col gap-2 p-4 text-left transition-all duration-200"
                        style={{
                          background: selected ? 'oklch(0.962 0.005 90)' : 'oklch(0.979 0.004 90)',
                          border: selected
                            ? '1px solid oklch(0.668 0.063 64)'
                            : '1px solid oklch(0.656 0.016 78 / 0.2)',
                          boxShadow: selected ? '0 0 0 1px oklch(0.668 0.063 64)' : 'none',
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <Icon
                            className="w-5 h-5"
                            style={{
                              color: selected
                                ? 'oklch(0.668 0.063 64)'
                                : 'oklch(0.656 0.016 78)',
                            }}
                          />
                          {selected && (
                            <CheckCircle2
                              className="w-4 h-4"
                              style={{ color: 'oklch(0.551 0.041 147)' }}
                            />
                          )}
                        </div>
                        <div>
                          <p
                            className="text-sm font-medium"
                            style={{ color: 'oklch(0.21 0 0)' }}
                          >
                            {label}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: 'oklch(0.656 0.016 78)' }}>
                            {description}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
                <p
                  className="flex items-center gap-2 text-xs mt-5"
                  style={{ color: 'oklch(0.656 0.016 78)' }}
                >
                  <Lock className="w-3.5 h-3.5" />
                  Confirmación inmediata por email tras la compra.
                </p>
              </section>

              <Link
                href="/carrito"
                className="inline-flex items-center gap-2 text-xs transition-colors"
                style={{ color: 'oklch(0.656 0.016 78)' }}
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Volver al carrito
              </Link>
            </div>

            {/* RIGHT — Order summary */}
            <aside
              className="p-7 lg:sticky lg:top-28"
              style={{
                background: 'oklch(0.962 0.005 90)',
                border: '1px solid oklch(0.656 0.016 78 / 0.15)',
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="rule-cobre" />
                <span
                  className="text-xs tracking-[0.25em] uppercase"
                  style={{ color: 'oklch(0.668 0.063 64)' }}
                >
                  Tu pedido
                </span>
              </div>

              <ul className="space-y-4 mb-6 max-h-72 overflow-y-auto pr-1">
                {items.map(({ product, quantity }) => (
                  <li key={product.id} className="flex gap-3">
                    <div
                      className="relative w-14 h-14 flex-shrink-0 overflow-hidden"
                      style={{
                        background: 'oklch(0.979 0.004 90)',
                        border: '1px solid oklch(0.656 0.016 78 / 0.15)',
                      }}
                    >
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-contain p-1"
                          sizes="56px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-5 h-5" style={{ color: 'oklch(0.656 0.016 78 / 0.4)' }} />
                        </div>
                      )}
                      <span
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center text-[10px] font-medium"
                        style={{
                          background: 'oklch(0.21 0 0)',
                          color: 'oklch(0.979 0.004 90)',
                        }}
                      >
                        {quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-medium truncate"
                        style={{ color: 'oklch(0.21 0 0)' }}
                      >
                        {product.name}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'oklch(0.656 0.016 78)' }}>
                        {product.price.toFixed(2).replace('.', ',')}€ × {quantity}
                      </p>
                    </div>
                    <span
                      className="text-xs font-medium"
                      style={{ color: 'oklch(0.21 0 0)' }}
                    >
                      {(product.price * quantity).toFixed(2).replace('.', ',')}€
                    </span>
                  </li>
                ))}
              </ul>

              <div className="space-y-2.5 pt-5 border-t border-[oklch(0.656_0.016_78/0.15)]">
                <Row label="Subtotal" value={`${subtotal.toFixed(2).replace('.', ',')}€`} />
                <Row
                  label={
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5" /> Envío
                    </span>
                  }
                  value={
                    shippingCost === 0
                      ? 'Gratis'
                      : `${shippingCost.toFixed(2).replace('.', ',')}€`
                  }
                  valueColor={shippingCost === 0 ? 'oklch(0.551 0.041 147)' : 'oklch(0.21 0 0)'}
                />
              </div>

              <div className="flex justify-between items-baseline pt-4 mt-4 border-t border-[oklch(0.656_0.016_78/0.15)]">
                <span
                  className="text-sm font-medium"
                  style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
                >
                  Total
                </span>
                <span
                  className="text-2xl"
                  style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.668 0.063 64)' }}
                >
                  {total.toFixed(2).replace('.', ',')}€
                </span>
              </div>

              <button
                type="submit"
                disabled={createOrder.isPending}
                className="w-full flex items-center justify-center gap-2 py-4 mt-6 text-sm font-medium tracking-wide transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: 'oklch(0.21 0 0)', color: 'oklch(0.979 0.004 90)' }}
              >
                {createOrder.isPending ? (
                  'Procesando...'
                ) : (
                  <>
                    Confirmar pedido <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p
                className="flex items-center justify-center gap-1.5 text-xs mt-4"
                style={{ color: 'oklch(0.656 0.016 78)' }}
              >
                <Lock className="w-3 h-3" /> Compra segura
              </p>
            </aside>
          </div>
        </form>
      </div>
    </main>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
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
      {error && (
        <p className="text-xs mt-1.5" style={{ color: 'oklch(0.55 0.18 25)' }}>
          {error}
        </p>
      )}
    </div>
  )
}

function Row({
  label,
  value,
  valueColor = 'oklch(0.21 0 0)',
}: {
  label: React.ReactNode
  value: string
  valueColor?: string
}) {
  return (
    <div className="flex justify-between text-sm">
      <span style={{ color: 'oklch(0.45 0 0)' }}>{label}</span>
      <span style={{ color: valueColor }}>{value}</span>
    </div>
  )
}
