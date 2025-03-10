const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Create a test user
  const user = await prisma.user.create({
    data: {
      name: "Test User",
      email: "test@example.com",
      password: "hashedpassword123", // In production, use proper password hashing
      businessName: "Test Business",
      businessAddress: "123 Test Street",
      type: "business"
    }
  })

  // Create a test calculation
  const calculation = await prisma.calculation.create({
    data: {
      type: 'gross-profit-daily',
      inputs: {
        revenue: 1000000,
        costOfGoodsSold: 600000
      },
      results: {
        grossProfit: 400000,
        profitMargin: 40
      }
    }
  })

  console.log({ user, calculation })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
