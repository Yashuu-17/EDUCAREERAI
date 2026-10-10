const { PrismaClient } = require('@prisma/client');

let prisma;

if (!global.__prisma) {
  global.__prisma = new PrismaClient({
    log: ['error', 'warn'],
  });
}
prisma = global.__prisma;

async function testConnection() {
  try {
    await prisma.$connect();
    console.log(' SQLite Database connected successfully via Prisma ORM.');
    return true;
  } catch (error) {
    console.error(' Database connection failed:', error.message);
    return false;
  }
}

module.exports = {
  prisma,
  testConnection,
};
