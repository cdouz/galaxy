import { getCookie } from "./cookies"

const API_URL = import.meta.env.VITE_API_URL
const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"])

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

type ApiFetchOptions = Omit<RequestInit, "body"> & { body?: unknown }

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { method = "GET", body, headers, ...rest } = options
  const upperMethod = method.toUpperCase()

  const requestHeaders = new Headers(headers)
  if (body !== undefined) {
    requestHeaders.set("Content-Type", "application/json")
  }
  if (MUTATING_METHODS.has(upperMethod)) {
    const csrfToken = getCookie("XSRF-TOKEN")
    if (csrfToken) {
      requestHeaders.set("X-XSRF-TOKEN", csrfToken)
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    method: upperMethod,
    headers: requestHeaders,
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const text = await response.text()
  const data = text ? JSON.parse(text) : undefined

  if (!response.ok) {
    const message = (data as { message?: string } | undefined)?.message ?? response.statusText
    throw new ApiError(response.status, message)
  }

  return data as T
}
