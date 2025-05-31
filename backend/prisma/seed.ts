// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()

// async function main() {
//   const user = await prisma.user.upsert({
//     where: { username: 'alice' },
//     update: {},
//     create: {
//       username: 'alice',
//       ping_interval: 60,
//     },
//   })

//   await prisma.agent.create({
//     data: {
//       userId: user.id,
//       address: '192.168.100.100',
//     },
//   })

//   console.log('Seeding done!')
// }

// main()
//   .catch((e) => {
//     console.error(e)
//     process.exit(1)
//   })
//   .finally(() => prisma.$disconnect())
