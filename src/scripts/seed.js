const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 🔹 Hash passwords properly
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('securepassword', salt);
  
  // 🔹 Create Users
  const admin = await prisma.user.upsert({
    where: { email: 'jitesh_admin@gmail.com' },
    update: {},
    create: {
      email: 'jitesh_admin@gmail.com',
      password: hashedPassword,
      role: 'ADMIN',
      name: 'Admin User',
    },
  });

  const librarian = await prisma.user.upsert({
    where: { email: 'jitesh_librarian@gmail.com' },
    update: {},
    create: {
      email: 'jitesh_librarian@gmail.com',
      password: hashedPassword,
      role: 'LIBRARIAN',
      name: 'Librarian User',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'jitesh_user@gmail.com' },
    update: {},
    create: {
      email: 'jitesh_user@gmail.com',
      password: hashedPassword,
      role: 'USER',
      name: 'Regular User',
    },
  });

  console.log('✅ Database seeding complete!');
}

main()
  .catch((error) => {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
