// ─── AUTH ─────────────────────────────────────────────────────────────────────

export type UserRole = 'CUSTOMER' | 'THERAPIST' | 'ADMIN'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: UserRole
  isActive: boolean
  loyaltyPoints: number
  createdAt: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: User
    token: string
  }
}

export interface MeResponse {
  success: boolean
  data: { user: User }
}

// ─── SERVICES ─────────────────────────────────────────────────────────────────

export interface ServiceCategory {
  id: string
  name: string
  slug: string
  description?: string
  order: number
  isActive: boolean
}

export interface Service {
  id: string
  name: string
  slug: string
  description?: string
  shortDescription?: string
  price: number
  duration: number
  images: string[]
  isActive: boolean
  isFeatured: boolean
  category?: ServiceCategory
  categoryId: string
  createdAt: string
}

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────

export interface ProductCategory {
  id: string
  name: string
  slug: string
  description?: string | null
  image?: string | null
  order: number
  isActive: boolean
  parentId?: string | null
  /** Solo presente si la API devuelve el árbol (?tree=true) */
  children?: ProductCategoryNode[]
  /** Solo presente con ?includeCount=true */
  productCount?: number
}

/** Nodo de categoría con sus hijos resueltos (estructura recursiva). */
export interface ProductCategoryNode extends ProductCategory {
  children: ProductCategoryNode[]
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  shortDescription?: string
  price: number
  stock: number
  images: string[]
  brand?: string
  isActive: boolean
  isFeatured: boolean
  category?: ProductCategory
  categoryId: string
  createdAt: string
}

// ─── BOOKINGS ─────────────────────────────────────────────────────────────────

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'NO_SHOW'

export interface Booking {
  id: string
  bookingNumber: string
  /** ISO-8601 (Prisma DateTime) */
  date: string
  /** HH:MM (24h) — campo nativo del backend */
  time: string
  duration: number
  status: BookingStatus
  price: number
  notes?: string
  service: Pick<Service, 'id' | 'name' | 'slug' | 'duration' | 'price'>
  therapist?: Pick<User, 'id' | 'firstName' | 'lastName'>
  createdAt: string
}

// ─── ORDERS ───────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED'

export type PaymentMethod =
  | 'CARD'
  | 'APPLE_PAY'
  | 'GOOGLE_PAY'
  | 'BIZUM'
  | 'BANK_TRANSFER'

export interface OrderItem {
  id: string
  quantity: number
  unitPrice: number
  totalPrice: number
  product: Pick<Product, 'id' | 'name' | 'slug' | 'images'>
}

export interface Order {
  id: string
  orderNumber: string
  subtotal: number
  shippingCost: number
  total: number
  status: OrderStatus
  paymentMethod: PaymentMethod
  trackingNumber?: string
  shippingAddress: Record<string, unknown>
  notes?: string
  items: OrderItem[]
  createdAt: string
}

// ─── CLASSES ──────────────────────────────────────────────────────────────────

export interface ClassSchedule {
  id: string
  /** 0 = domingo, 6 = sábado */
  dayOfWeek: number
  startTime: string
  endTime: string
  maxStudents: number
  location?: string
  isActive: boolean
}

export type EnrollmentType = 'SINGLE_CLASS' | 'MONTHLY' | 'QUARTERLY'
export type EnrollmentStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED'

export interface GroupClass {
  id: string
  name: string
  slug: string
  description?: string
  shortDescription?: string
  pricePerSession: number
  priceMonthly?: number | null
  benefits: string[]
  images: string[]
  isActive: boolean
  schedules: ClassSchedule[]
  /** Inscripciones activas (campo añadido por el controller) */
  activeEnrollments?: number
  createdAt: string
}

export interface ClassEnrollment {
  id: string
  classId: string
  enrollmentType: EnrollmentType
  status: EnrollmentStatus
  startDate: string
  endDate?: string | null
  class?: Pick<GroupClass, 'id' | 'name' | 'slug' | 'images'> & {
    pricePerSession: number
    priceMonthly?: number | null
    schedules?: ClassSchedule[]
  }
}

// ─── REVIEWS ──────────────────────────────────────────────────────────────────

export interface Review {
  id: string
  rating: number
  comment?: string
  /** El backend usa un booleano único; "pendiente" = isApproved: false */
  isApproved: boolean
  productId?: string | null
  serviceId?: string | null
  user: Pick<User, 'id' | 'firstName' | 'lastName'>
  createdAt: string
}

export interface ReviewStats {
  averageRating: number | null
  totalReviews: number
}

// ─── LOYALTY ──────────────────────────────────────────────────────────────────

export type LoyaltyType = 'EARNED' | 'REDEEMED' | 'EXPIRED' | 'BONUS' | 'ADJUSTED'

export interface LoyaltyTransaction {
  id: string
  points: number
  type: LoyaltyType
  description: string
  createdAt: string
}

// ─── ADDRESS ──────────────────────────────────────────────────────────────────

export interface Address {
  id: string
  street: string
  city: string
  /** Provincia (en el modelo Prisma se llama `state`) */
  state: string
  postalCode: string
  country: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

// ─── ADMIN STATS ──────────────────────────────────────────────────────────────

export interface DashboardStats {
  users: { total: number; active: number; newThisMonth: number }
  orders: { total: number; pending: number; revenue: number; revenueThisMonth: number }
  bookings: { total: number; pending: number; confirmed: number }
  products: { total: number; active: number; lowStock: number }
  services: { total: number; active: number }
  classes: { total: number; active: number }
  reviews: { pending: number; approved: number }
  newsletter: { total: number }
}

// ─── API GENERIC ──────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
  errors?: Array<{ msg: string; path: string }>
}

export interface PaginatedResponse<T> {
  success: boolean
  data: {
    [key: string]: T[] | Pagination
    pagination: Pagination
  }
}

export interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}
