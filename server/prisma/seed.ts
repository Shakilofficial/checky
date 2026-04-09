import 'dotenv/config';
import { PrismaClient, UserRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const saltRounds = 10;

  const adminPassword = await bcrypt.hash('admin123', saltRounds);
  const userPassword = await bcrypt.hash('user123', saltRounds);

  // Create Admin
  await prisma.user.upsert({
    where: { email: 'admin@tasksystem.com' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@tasksystem.com',
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  // Create Normal User
  await prisma.user.upsert({
    where: { email: 'user@tasksystem.com' },
    update: {},
    create: {
      name: 'Regular User',
      email: 'user@tasksystem.com',
      password: userPassword,
      role: UserRole.USER,
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
