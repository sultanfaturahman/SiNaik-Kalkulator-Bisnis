import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 

export async function getAllCalculations() {
  try {
    return await prisma.calculation.findMany({
      orderBy: {
        date: 'desc'
      }
    })
  } catch (error) {
    console.error('Error fetching calculations:', error)
    return []
  }
}

export async function getCalculationsByDateRange(startDate: Date, endDate: Date) {
  try {
    return await prisma.calculation.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        date: 'desc'
      }
    })
  } catch (error) {
    console.error('Error fetching calculations by date range:', error)
    return []
  }
}

export async function getCalculationsByType(type: string) {
  try {
    return await prisma.calculation.findMany({
      where: {
        type: type
      },
      orderBy: {
        date: 'desc'
      }
    })
  } catch (error) {
    console.error('Error fetching calculations by type:', error)
    return []
  }
}

export async function createCalculation(data: {
  type: string
  inputs: Record<string, any>
  results: Record<string, any>
}) {
  try {
    return await prisma.calculation.create({
      data: {
        type: data.type,
        inputs: data.inputs,
        results: data.results
      }
    })
  } catch (error) {
    console.error('Error creating calculation:', error)
    throw error
  }
}

export async function deleteCalculation(id: number) {
  try {
    return await prisma.calculation.delete({
      where: { id }
    })
  } catch (error) {
    console.error('Error deleting calculation:', error)
    throw error
  }
} 