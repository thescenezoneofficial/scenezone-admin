'use server'

import { ApiError } from './exceptions'

const BACKEND_URL = process.env.NEXT_BACKEND_API_URL

export async function fetchApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${BACKEND_URL}${path}`

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  let response: Response
  try {
    response = await fetch(url, { ...options, headers })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new ApiError('Network error. Please check your connection.', 503)
  }

  // Handle parsing based on content type
  let data
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json()
    } catch {
      throw new ApiError('Invalid JSON response from server', 500)
    }
  }

  // If status is not 2xx, throw error using the parsed message if available
  if (!response.ok) {
    throw new ApiError(data?.message || data?.error || `Request failed (${response.status})`, response.status)
  }

  return data as T
}