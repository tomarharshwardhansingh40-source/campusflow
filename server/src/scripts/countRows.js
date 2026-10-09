import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('📊 CampusFlow Database Table Row Counts:\n')

  const [
    userCount,
    courseCount,
    enrollmentCount,
    announcementCount,
    assignmentCount,
    resourceCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.enrollment.count(),
    prisma.announcement.count(),
    prisma.assignment.count(),
    prisma.resource.count(),
  ])

  console.table([
    { Table: 'users', 'Row Count': userCount },
    { Table: 'courses', 'Row Count': courseCount },
    { Table: 'enrollments', 'Row Count': enrollmentCount },
    { Table: 'announcements', 'Row Count': announcementCount },
    { Table: 'assignments', 'Row Count': assignmentCount },
    { Table: 'resources', 'Row Count': resourceCount },
  ])

  const total = userCount + courseCount + enrollmentCount + announcementCount + assignmentCount + resourceCount
  console.log(`\nTotal Records: ${total}`)
}

main()
  .catch((err) => {
    console.error('❌ Error reading database row counts:', err.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
