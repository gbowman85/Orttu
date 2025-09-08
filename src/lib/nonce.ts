import { headers } from 'next/headers'

/**
 * Get the nonce for the current request
 * This should only be called in Server Components
 */
export async function getNonce(): Promise<string | null> {
  const headersList = await headers()
  return headersList.get('x-nonce')
}

/**
 * Get the nonce synchronously (for use in middleware or other contexts)
 * This is a fallback for when async headers() is not available
 */
export function getNonceSync(): string | null {
  // This is a placeholder - in practice, nonces are handled in middleware
  // and passed through headers
  return null
}
