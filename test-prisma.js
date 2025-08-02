const { PrismaClient } = require('@prisma/client');

async function testPrisma() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing Prisma connection...');
    const modules = await prisma.module.findMany();
    console.log('Success! Found modules:', modules);
  } catch (error) {
    console.error('Prisma error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPrisma(); 