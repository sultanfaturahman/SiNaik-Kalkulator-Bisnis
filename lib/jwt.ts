import { verify } from 'jsonwebtoken'

export async function verifyJwtToken(token: string) {
  try {
    const decoded = verify(token, process.env.JWT_SECRET || 'your-fallback-secret')
    return decoded as { userId: string; email: string; userType: string }
  } catch (error) {
    throw new Error('Invalid token')
  }
}