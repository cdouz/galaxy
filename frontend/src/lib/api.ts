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
  // Not every response is ours: a container error page, a proxy timeout or a
  // Tomcat stack trace all come back as HTML. Parsing those must not escape as
  // a SyntaxError, because every caller branches on `instanceof ApiError`.
  const data = parseJson(text)

  if (!response.ok) {
    const message = (data as { message?: string } | undefined)?.message ?? response.statusText
    throw new ApiError(response.status, message)
  }

  if (text && data === undefined) {
    throw new ApiError(response.status, "Unexpected response from the server")
  }

  return data as T
}

function parseJson(text: string): unknown {
  if (!text) {
    return undefined
  }
  try {
    return JSON.parse(text)
  } catch {
    return undefined
  }
}
