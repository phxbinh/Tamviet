export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 3
) {
  const controller = new AbortController()

  const timeout = setTimeout(() => {
    controller.abort()
  }, 5000)

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal
    })

    clearTimeout(timeout)

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`)
    }

    return res
  } catch (err) {
    clearTimeout(timeout)

    if (retries === 0) throw err

    await new Promise((r) => setTimeout(r, 1000))

    return fetchWithRetry(url, options, retries - 1)
  }
}



/* Cách sử dụng
import { fetchWithRetry } from "@/lib/fetchWithRetry"

const res = await fetchWithRetry(
  `${process.env.NEXT_PUBLIC_SITE_URL}/api/products`
)

const products = await res.json()

*/