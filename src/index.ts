import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main () {
    const newUser = await prisma.user.create({
        data: {
            name: 'Alice',
            email: 'alice@prisma.io',
           },
        })
        console.log('Created user:', newUser)
      }

      main()
        .catch((e) => console.error(e))
        .finally(async () => await prisma.$disconnect())

