import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting CampusFlow database seed...')

  // 1. Clear existing data in reverse relational dependency order
  await prisma.resource.deleteMany()
  await prisma.assignment.deleteMany()
  await prisma.announcement.deleteMany()
  await prisma.enrollment.deleteMany()
  await prisma.course.deleteMany()
  await prisma.user.deleteMany()
  console.log('🧹 Cleared existing database records.')

  // 2. Hash common password
  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash('password123', salt)

  // 3. Create Users
  const facultySharma = await prisma.user.create({
    data: {
      name: 'Dr. Sharma',
      email: 'faculty@demo.edu',
      passwordHash,
      role: 'faculty',
    },
  })

  const studentAlex = await prisma.user.create({
    data: {
      name: 'Alex Johnson',
      email: 'student@demo.edu',
      passwordHash,
      role: 'student',
    },
  })

  const studentPriya = await prisma.user.create({
    data: {
      name: 'Priya Patel',
      email: 'student2@demo.edu',
      passwordHash,
      role: 'student',
    },
  })
  console.log('👤 Created 1 faculty and 2 student accounts.')

  // 4. Create Courses (Taught by Dr. Sharma)
  const courseDbms = await prisma.course.create({
    data: {
      code: 'CS201',
      name: 'Database Management Systems',
      facultyId: facultySharma.id,
    },
  })

  const courseOs = await prisma.course.create({
    data: {
      code: 'CS202',
      name: 'Operating Systems',
      facultyId: facultySharma.id,
    },
  })
  console.log('📚 Created courses: CS201 (DBMS) and CS202 (OS).')

  // 5. Enrollments: Both in CS201; only Priya in CS202
  await prisma.enrollment.createMany({
    data: [
      { userId: studentAlex.id, courseId: courseDbms.id },
      { userId: studentPriya.id, courseId: courseDbms.id },
      { userId: studentPriya.id, courseId: courseOs.id },
    ],
  })
  console.log('🎓 Enrolled Alex in CS201; Priya in CS201 & CS202.')

  // 6. Announcements
  // (a) College-wide general announcement
  await prisma.announcement.create({
    data: {
      courseId: null, // college-wide
      authorId: facultySharma.id,
      title: 'Annual Campus Tech Symposium 2026',
      body: 'All students and faculty are invited to attend the Annual Tech Symposium in the main auditorium next Friday. Keynotes will focus on modern web architectures and AI development.',
      category: 'general',
      eventDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    },
  })

  // (b) Exam announcement in CS201 with event date
  await prisma.announcement.create({
    data: {
      courseId: courseDbms.id,
      authorId: facultySharma.id,
      title: 'CS201 Midterm Examination Schedule',
      body: 'The DBMS Midterm will cover Relational Algebra, SQL queries, ER diagrams, and Normalization up to 3NF. Please arrive 15 minutes before the exam starts.',
      category: 'exam',
      eventDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
  })

  // (c) General announcement in CS202
  await prisma.announcement.create({
    data: {
      courseId: courseOs.id,
      authorId: facultySharma.id,
      title: 'Operating Systems Lab Setup Guidelines',
      body: 'Please ensure your Linux VMs are configured with gcc and POSIX pthread support before next Tuesday lab session.',
      category: 'general',
    },
  })
  console.log('📢 Created 3 announcements (1 college-wide, 1 exam in CS201, 1 general in CS202).')

  // 7. Assignments: 2 in CS201, 1 in CS202 (due between 2 and 7 days from now)
  const now = Date.now()
  await prisma.assignment.create({
    data: {
      courseId: courseDbms.id,
      authorId: facultySharma.id,
      title: 'Assignment 1: Relational Schema & 3NF Normalization',
      description: 'Decompose the given e-commerce transaction schema into 3NF. Provide functional dependency diagrams and explain all candidate keys.',
      dueDate: new Date(now + 3 * 24 * 60 * 60 * 1000), // Due in 3 days
    },
  })

  await prisma.assignment.create({
    data: {
      courseId: courseDbms.id,
      authorId: facultySharma.id,
      title: 'Assignment 2: Complex SQL Queries & Indexing',
      description: 'Write optimized PostgreSQL queries using window functions, CTEs, and create composite B-tree indexes for the flight booking schema.',
      dueDate: new Date(now + 6 * 24 * 60 * 60 * 1000), // Due in 6 days
    },
  })

  await prisma.assignment.create({
    data: {
      courseId: courseOs.id,
      authorId: facultySharma.id,
      title: 'Assignment 1: Round Robin & Priority Scheduling Simulation',
      description: 'Implement a preemptive Round Robin CPU scheduler in C or Python. Calculate turnaround time, waiting time, and CPU utilization across 10 processes.',
      dueDate: new Date(now + 4 * 24 * 60 * 60 * 1000), // Due in 4 days
    },
  })
  console.log('📝 Created 3 assignments with upcoming due dates.')

  // 8. Resources: 2 with realistic pasted study notes in contentText, 1 with linkUrl
  await prisma.resource.create({
    data: {
      courseId: courseDbms.id,
      uploaderId: facultySharma.id,
      title: 'Database Normalization Quick Reference Notes',
      description: 'Comprehensive review notes covering 1NF, 2NF, 3NF, and BCNF decomposition rules.',
      linkUrl: null,
      contentText: `# Database Normalization Guide
## First Normal Form (1NF)
- Each column must contain atomic (indivisible) values.
- No repeating groups or arrays within a single attribute.
- Every table must have a designated primary key.

## Second Normal Form (2NF)
- Must already satisfy 1NF.
- Eliminate partial dependencies: no non-prime attribute may depend on a proper subset of any composite candidate key.
- If primary key consists of a single attribute, the relation is automatically in 2NF once in 1NF.

## Third Normal Form (3NF)
- Must already satisfy 2NF.
- Eliminate transitive functional dependencies: for every non-trivial functional dependency X -> Y, either X is a superkey or Y is a prime attribute.

## Boyce-Codd Normal Form (BCNF)
- Stricter version of 3NF.
- For every non-trivial dependency X -> Y, X must strictly be a superkey.`,
    },
  })

  await prisma.resource.create({
    data: {
      courseId: courseOs.id,
      uploaderId: facultySharma.id,
      title: 'CPU Scheduling Algorithms Summary Sheet',
      description: 'Key formulas, preemptive vs non-preemptive comparisons, and dispatch latency notes.',
      linkUrl: null,
      contentText: `# CPU Scheduling Summary
## Core Metrics
- Turnaround Time = Completion Time - Arrival Time
- Waiting Time = Turnaround Time - Burst Time
- Response Time = Time until first CPU response - Arrival Time

## Scheduling Algorithms
1. First-Come, First-Served (FCFS): Non-preemptive, suffers from Convoy Effect when a long burst process runs first.
2. Shortest Job First (SJF): Provably optimal average waiting time. Preemptive version is Shortest Remaining Time First (SRTF).
3. Round Robin (RR): Preemptive scheduler using fixed time quantum (q). If q is very large, RR behaves like FCFS; if q is too small, context switch overhead dominates.
4. Multilevel Feedback Queue (MLFQ): Separates processes by CPU-burst characteristics without requiring prior execution knowledge.`,
    },
  })

  await prisma.resource.create({
    data: {
      courseId: courseDbms.id,
      uploaderId: facultySharma.id,
      title: 'Official PostgreSQL 16 Documentation Portal',
      description: 'Reference link for advanced indexing, EXPLAIN ANALYZE execution plans, and query optimization.',
      linkUrl: 'https://www.postgresql.org/docs/current/',
      contentText: null,
    },
  })
  console.log('📎 Created 3 resources (2 with pasted study notes, 1 with documentation link).')

  console.log('✅ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
