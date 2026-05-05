import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'

// ─── Axios instance ────────────────────────────────────────────────────────────

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token from localStorage on every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Normalise error shape so callers always get a string message
api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<{ message?: string; errors?: Array<{ msg: string }> }>) => {
    const data = error.response?.data
    const message =
      data?.message ??
      data?.errors?.[0]?.msg ??
      error.message ??
      'Error de conexión con el servidor'
    return Promise.reject(new Error(message))
  }
)

export default api

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  register: (body: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
  }) => api.post('/auth/register', body),

  login: (body: { email: string; password: string }) =>
    api.post('/auth/login', body),

  me: () => api.get('/auth/me'),

  updateProfile: (body: Partial<{ firstName: string; lastName: string; phone: string }>) =>
    api.put('/auth/profile', body),

  changePassword: (body: { currentPassword: string; newPassword: string; confirmNewPassword: string }) =>
    api.put('/auth/change-password', body),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (body: { token: string; newPassword: string; confirmNewPassword: string }) =>
    api.post('/auth/reset-password', body),
}

// ─── Services ─────────────────────────────────────────────────────────────────

export const servicesApi = {
  getAll: (params?: Record<string, unknown>) => api.get('/services', { params }),
  getBySlug: (slug: string) => api.get(`/services/slug/${slug}`),
  getReviews: (id: string) => api.get(`/services/${id}/reviews`),
  create: (data: FormData) =>
    api.post('/services', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, data: FormData) =>
    api.put(`/services/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: string) => api.delete(`/services/${id}`),
}

export const serviceCategoriesApi = {
  getAll: () => api.get('/categories'),
  create: (body: { name: string; description?: string }) => api.post('/categories', body),
  update: (id: string, body: { name?: string; description?: string }) =>
    api.put(`/categories/${id}`, body),
  delete: (id: string) => api.delete(`/categories/${id}`),
  reorder: (items: Array<{ id: string; order: number }>) =>
    api.patch('/categories/reorder', { items }),
}

// ─── Products ─────────────────────────────────────────────────────────────────

export const productsApi = {
  getAll: (params?: {
    category?: string
    search?: string
    minPrice?: number
    maxPrice?: number
    isFeatured?: boolean
    page?: number
    limit?: number
  }) => api.get('/products', { params }),
  getBySlug: (slug: string) => api.get(`/products/slug/${slug}`),
  create: (data: FormData) =>
    api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, data: FormData) =>
    api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: string) => api.delete(`/products/${id}`),
}

export const productCategoriesApi = {
  getAll: () => api.get('/product-categories'),
  create: (body: { name: string; description?: string }) =>
    api.post('/product-categories', body),
  update: (id: string, body: { name?: string; description?: string }) =>
    api.put(`/product-categories/${id}`, body),
  delete: (id: string) => api.delete(`/product-categories/${id}`),
  reorder: (items: Array<{ id: string; order: number }>) =>
    api.patch('/product-categories/reorder', { items }),
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const bookingsApi = {
  create: (body: {
    serviceId: string
    /** YYYY-MM-DD */
    date: string
    /** HH:MM (24h) — coincide con el campo `time` del backend */
    time: string
    notes?: string
  }) => api.post('/bookings', body),
  getMyBookings: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get('/bookings/my', { params }),
  getMyBookingById: (id: string) => api.get(`/bookings/my/${id}`),
  cancelMyBooking: (id: string) => api.patch(`/bookings/my/${id}/cancel`),
  getMyAgenda: (params?: { dateFrom?: string; dateTo?: string }) =>
    api.get('/bookings/my-agenda', { params }),
  // Admin
  getAll: (params?: Record<string, unknown>) => api.get('/bookings', { params }),
  getById: (id: string) => api.get(`/bookings/${id}`),
  updateStatus: (id: string, status: string, notes?: string) =>
    api.patch(`/bookings/${id}/status`, { status, notes }),
  assignTherapist: (id: string, therapistId: string) =>
    api.patch(`/bookings/${id}/assign`, { therapistId }),
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export const ordersApi = {
  create: (body: {
    items: Array<{ productId: string; quantity: number }>
    shippingAddress: Record<string, unknown>
    paymentMethod: string
    notes?: string
  }) => api.post('/orders', body),
  getMyOrders: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get('/orders/my', { params }),
  getMyOrderById: (id: string) => api.get(`/orders/my/${id}`),
  cancelMyOrder: (id: string) => api.patch(`/orders/my/${id}/cancel`),
  // Admin
  getAll: (params?: Record<string, unknown>) => api.get('/orders', { params }),
  getById: (id: string) => api.get(`/orders/${id}`),
  updateStatus: (id: string, status: string) =>
    api.patch(`/orders/${id}/status`, { status }),
  addTracking: (id: string, trackingNumber: string) =>
    api.patch(`/orders/${id}/tracking`, { trackingNumber }),
}

// ─── Classes ──────────────────────────────────────────────────────────────────

export type EnrollmentType = 'SINGLE_CLASS' | 'MONTHLY' | 'QUARTERLY'

export const classesApi = {
  getAll: (params?: Record<string, unknown>) => api.get('/classes', { params }),
  getBySlug: (slug: string) => api.get(`/classes/slug/${slug}`),
  enroll: (
    classId: string,
    body?: { enrollmentType?: EnrollmentType; scheduleId?: string }
  ) => api.post(`/classes/${classId}/enroll`, body ?? {}),
  cancelEnrollment: (classId: string) =>
    api.patch(`/classes/${classId}/enroll/cancel`),
  getMyEnrollments: () => api.get('/classes/my-enrollments'),
  // Admin
  create: (data: FormData) =>
    api.post('/classes', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, data: FormData) =>
    api.put(`/classes/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: string) => api.delete(`/classes/${id}`),
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export const reviewsApi = {
  getForProduct: (productId: string) => api.get(`/reviews/product/${productId}`),
  getForService: (serviceId: string) => api.get(`/reviews/service/${serviceId}`),
  create: (body: {
    rating: number
    comment?: string
    productId?: string
    serviceId?: string
  }) => api.post('/reviews', body),
  getMyReviews: () => api.get('/reviews/my'),
  update: (id: string, body: { rating?: number; comment?: string }) =>
    api.put(`/reviews/${id}`, body),
  delete: (id: string) => api.delete(`/reviews/${id}`),
  // Admin
  getPending: () => api.get('/reviews/pending'),
  approve: (id: string) => api.patch(`/reviews/${id}/approve`),
  reject: (id: string, reason?: string) =>
    api.patch(`/reviews/${id}/reject`, { reason }),
}

// ─── Addresses ────────────────────────────────────────────────────────────────

export const addressesApi = {
  getAll: () => api.get('/addresses/my'),
  create: (body: Record<string, unknown>) => api.post('/addresses/my', body),
  update: (id: string, body: Record<string, unknown>) =>
    api.put(`/addresses/my/${id}`, body),
  delete: (id: string) => api.delete(`/addresses/my/${id}`),
  setDefault: (id: string) => api.patch(`/addresses/my/${id}/default`),
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

export const newsletterApi = {
  subscribe: (email: string, name?: string) =>
    api.post('/newsletter/subscribe', { email, name }),
  unsubscribe: (email: string) =>
    api.post('/newsletter/unsubscribe', { email }),
}

// ─── Loyalty ──────────────────────────────────────────────────────────────────

export const loyaltyApi = {
  getHistory: (params?: { type?: string; page?: number; limit?: number }) =>
    api.get('/loyalty', { params }),
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params?: Record<string, unknown>) => api.get('/admin/users', { params }),
  getUserById: (id: string) => api.get(`/admin/users/${id}`),
  updateUserStatus: (id: string, isActive: boolean) =>
    api.patch(`/admin/users/${id}/status`, { isActive }),
  updateUserRole: (id: string, role: string) =>
    api.patch(`/admin/users/${id}/role`, { role }),
  awardLoyaltyPoints: (id: string, points: number, description: string) =>
    api.post(`/admin/users/${id}/loyalty`, { points, description }),
}
