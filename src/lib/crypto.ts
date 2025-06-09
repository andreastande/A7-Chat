import { UIMessage } from "ai"
import crypto from "crypto"

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY! // 32 bytes base64
const IV_LENGTH = 16

export function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "base64"), iv)
  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")
  return iv.toString("hex") + ":" + encrypted
}

export function decrypt(text: string) {
  const [ivHex, encrypted] = text.split(":")
  const iv = Buffer.from(ivHex, "hex")
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "base64"), iv)
  let decrypted = decipher.update(encrypted, "hex", "utf8")
  decrypted += decipher.final("utf8")
  return decrypted
}

function mapTextParts(uiMessage: UIMessage, fn: (plain: string) => string): UIMessage {
  return {
    ...uiMessage,
    parts: uiMessage.parts.map((part) =>
      part.type === "text" || part.type === "reasoning" ? { ...part, text: fn(part.text) } : part
    ),
  }
}

export const encryptUIMessage = (m: UIMessage) => mapTextParts(m, encrypt)
export const decryptUIMessage = (m: UIMessage) => mapTextParts(m, decrypt)
