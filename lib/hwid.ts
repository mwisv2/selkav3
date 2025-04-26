export async function generateHWID(): Promise<string> {
  // Get browser and device information
  const screenWidth = window.screen.width
  const screenHeight = window.screen.height
  const userAgent = navigator.userAgent
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const hardwareConcurrency = navigator.hardwareConcurrency || 0
  const deviceMemory = (navigator as any).deviceMemory || 0
  const platform = navigator.platform
  const language = navigator.language

  // Create a consistent string to hash
  const hwidString = `${screenWidth}-${screenHeight}-${userAgent}-${timezone}-${hardwareConcurrency}-${deviceMemory}-${platform}-${language}`

  // Generate SHA-256 hash
  const msgBuffer = new TextEncoder().encode(hwidString)
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

  // Format as SELKA-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX
  const formattedHash = hashHex.slice(0, 24).toUpperCase()
  return `SELKA-${formattedHash.slice(0, 4)}-${formattedHash.slice(4, 8)}-${formattedHash.slice(8, 12)}-${formattedHash.slice(12, 16)}-${formattedHash.slice(16, 20)}-${formattedHash.slice(20, 24)}`
}

export function getStoredHWID(): string | null {
  return localStorage.getItem("hwid")
}

export function storeHWID(hwid: string): void {
  localStorage.setItem("hwid", hwid)
}
