// ============================================================================
// Formatters & Validators
// Description: Utility functions for formatting and validating Brazilian data
// ============================================================================

// ============================================================================
// CPF Functions
// ============================================================================
export function formatCPF(cpf: string | null | undefined): string {
  if (!cpf) return ''
  const cleaned = cpf.replace(/\D/g, '')
  if (cleaned.length !== 11) return cpf

  return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`
}

export function unformatCPF(cpf: string): string {
  return cpf.replace(/\D/g, '')
}

export function validateCPF(cpf: string): boolean {
  const cleaned = unformatCPF(cpf)

  if (cleaned.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cleaned)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i)
  }
  let digit1 = 11 - (sum % 11)
  if (digit1 >= 10) digit1 = 0

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i)
  }
  let digit2 = 11 - (sum % 11)
  if (digit2 >= 10) digit2 = 0

  return (
    parseInt(cleaned.charAt(9)) === digit1 &&
    parseInt(cleaned.charAt(10)) === digit2
  )
}

export function maskCPF(value: string): string {
  const cleaned = unformatCPF(value)
  if (cleaned.length <= 3) return cleaned
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`
  if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`
  return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`
}

// ============================================================================
// CNPJ Functions
// ============================================================================
export function formatCNPJ(cnpj: string | null | undefined): string {
  if (!cnpj) return ''
  const cleaned = cnpj.replace(/\D/g, '')
  if (cleaned.length !== 14) return cnpj

  return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12)}`
}

export function unformatCNPJ(cnpj: string): string {
  return cnpj.replace(/\D/g, '')
}

export function validateCNPJ(cnpj: string): boolean {
  const cleaned = unformatCNPJ(cnpj)

  if (cleaned.length !== 14) return false
  if (/^(\d)\1{13}$/.test(cleaned)) return false

  let length = cleaned.length - 2
  let numbers = cleaned.substring(0, length)
  const digits = cleaned.substring(length)
  let sum = 0
  let pos = length - 7

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--
    if (pos < 2) pos = 9
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(digits.charAt(0))) return false

  length = length + 1
  numbers = cleaned.substring(0, length)
  sum = 0
  pos = length - 7

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--
    if (pos < 2) pos = 9
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  return result === parseInt(digits.charAt(1))
}

export function maskCNPJ(value: string): string {
  const cleaned = unformatCNPJ(value)
  if (cleaned.length <= 2) return cleaned
  if (cleaned.length <= 5) return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`
  if (cleaned.length <= 8) return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5)}`
  if (cleaned.length <= 12) return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8)}`
  return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12, 14)}`
}

// ============================================================================
// CEP Functions
// ============================================================================
export function formatCEP(cep: string | null | undefined): string {
  if (!cep) return ''
  const cleaned = cep.replace(/\D/g, '')
  if (cleaned.length !== 8) return cep

  return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`
}

export function unformatCEP(cep: string): string {
  return cep.replace(/\D/g, '')
}

export function validateCEP(cep: string): boolean {
  const cleaned = unformatCEP(cep)
  return cleaned.length === 8 && /^\d{8}$/.test(cleaned)
}

export function maskCEP(value: string): string {
  const cleaned = unformatCEP(value)
  if (cleaned.length <= 5) return cleaned
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`
}

// ============================================================================
// Phone Functions
// ============================================================================
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
  }
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
  }

  return phone
}

export function unformatPhone(phone: string): string {
  return phone.replace(/\D/g, '')
}

export function validatePhone(phone: string): boolean {
  const cleaned = unformatPhone(phone)
  return cleaned.length === 10 || cleaned.length === 11
}

export function maskPhone(value: string): string {
  const cleaned = unformatPhone(value)
  if (cleaned.length <= 2) return cleaned
  if (cleaned.length <= 6) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`
  if (cleaned.length <= 10) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`
}

// ============================================================================
// Currency Functions
// ============================================================================
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'R$ 0,00'

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[R$\s.]/g, '').replace(',', '.')
  return parseFloat(cleaned) || 0
}

export function maskCurrency(value: string): string {
  const cleaned = value.replace(/\D/g, '')
  const number = parseInt(cleaned) / 100

  return formatCurrency(number)
}

// ============================================================================
// Date Functions
// ============================================================================
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return ''

  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('pt-BR')
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return ''

  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('pt-BR')
}

export function formatDateISO(date: Date | null | undefined): string {
  if (!date) return ''
  return date.toISOString().split('T')[0]
}

export function parseDate(dateString: string): Date | null {
  if (!dateString) return null

  const parts = dateString.split(/[-/]/)
  if (parts.length !== 3) return null

  // Try DD/MM/YYYY format
  if (parts[0].length <= 2) {
    const day = parseInt(parts[0])
    const month = parseInt(parts[1]) - 1
    const year = parseInt(parts[2])
    return new Date(year, month, day)
  }

  // Try YYYY-MM-DD format
  const year = parseInt(parts[0])
  const month = parseInt(parts[1]) - 1
  const day = parseInt(parts[2])
  return new Date(year, month, day)
}

export function calculateAge(birthDate: string | Date | null | undefined): number | null {
  if (!birthDate) return null

  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate
  const today = new Date()

  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

export function diffInDays(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2

  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function diffInMonths(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2

  const years = d2.getFullYear() - d1.getFullYear()
  const months = d2.getMonth() - d1.getMonth()

  return years * 12 + months
}

// ============================================================================
// Number Functions
// ============================================================================
export function formatNumber(value: number | null | undefined, decimals: number = 0): string {
  if (value === null || value === undefined) return '0'

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value)
}

export function formatPercentage(value: number | null | undefined, decimals: number = 1): string {
  if (value === null || value === undefined) return '0%'

  return `${formatNumber(value, decimals)}%`
}

export function formatArea(value: number | null | undefined): string {
  if (value === null || value === undefined) return '0 m²'
  return `${formatNumber(value, 2)} m²`
}

// ============================================================================
// Address Functions
// ============================================================================
export function formatFullAddress(
  logradouro: string,
  numero: string,
  complemento: string | null | undefined,
  bairro: string,
  cidade: string,
  uf: string
): string {
  const parts = [
    `${logradouro}, ${numero}`,
    complemento,
    bairro,
    `${cidade} - ${uf}`
  ].filter(Boolean)

  return parts.join(' - ')
}

export function formatShortAddress(
  logradouro: string,
  numero: string,
  bairro: string
): string {
  return `${logradouro}, ${numero} - ${bairro}`
}

// ============================================================================
// Validation Functions
// ============================================================================
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateRequired(value: any): boolean {
  if (typeof value === 'string') return value.trim().length > 0
  if (typeof value === 'number') return !isNaN(value)
  return value !== null && value !== undefined
}

export function validateMinLength(value: string, minLength: number): boolean {
  return value.trim().length >= minLength
}

export function validateMaxLength(value: string, maxLength: number): boolean {
  return value.trim().length <= maxLength
}

export function validateRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

export function validatePositive(value: number): boolean {
  return value > 0
}

export function validateNonNegative(value: number): boolean {
  return value >= 0
}

// ============================================================================
// String Functions
// ============================================================================
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .map(word => capitalize(word))
    .join(' ')
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return `${str.slice(0, maxLength)}...`
}

export function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

// ============================================================================
// File Functions
// ============================================================================
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export function getFileExtension(filename: string): string {
  return filename.slice(filename.lastIndexOf('.') + 1).toLowerCase()
}

// ============================================================================
// Status Functions
// ============================================================================
export function getStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    ativo: 'Ativo',
    pendente: 'Pendente',
    encerrado: 'Encerrado',
    cancelado: 'Cancelado',
    renovado: 'Renovado'
  }

  return statusMap[status] || status
}

export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    ativo: 'green',
    pendente: 'yellow',
    encerrado: 'gray',
    cancelado: 'red',
    renovado: 'blue'
  }

  return colorMap[status] || 'gray'
}

// ============================================================================
// Contract Functions
// ============================================================================
export function calculateMonthsDuration(startDate: Date | string, endDate: Date | string): number {
  return diffInMonths(startDate, endDate)
}

export function calculateDaysRemaining(endDate: Date | string): number {
  return diffInDays(new Date(), endDate)
}

export function isContractExpiringSoon(endDate: Date | string, daysThreshold: number = 60): boolean {
  const daysRemaining = calculateDaysRemaining(endDate)
  return daysRemaining > 0 && daysRemaining <= daysThreshold
}

export function isContractExpired(endDate: Date | string): boolean {
  return new Date(endDate) < new Date()
}
