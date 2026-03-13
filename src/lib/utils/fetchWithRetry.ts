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



/* Cách sử dụng ở trang products
import { fetchWithRetry } from "@/lib/fetchWithRetry"

const res = await fetchWithRetry(
  `${process.env.NEXT_PUBLIC_SITE_URL}/api/products`
)

const products = await res.json()
*/


/* Cách dùng trong component
useEffect(() => {
  async function load() {
    const res = await fetchWithRetry("/api/products")
    const data = await res.json()
    setProducts(data)
  }

  load()
}, [])
*/




