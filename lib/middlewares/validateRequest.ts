import { NextResponse } from 'next/server'
import { z } from 'zod'

export function validateRequest<T>(
  schema: z.Schema<T>,
  handler: (validatedData: T) => Promise<NextResponse>
) {
  return async (request: Request) => {
    try {
      const body = await request.json()
      const validatedData = schema.parse(body)
      return await handler(validatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation failed', details: error.errors },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      )
    }
  }
}