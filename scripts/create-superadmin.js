// Script to create initial SUPERADMIN user
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

async function createSuperAdmin() {
  try {
    // Check if SUPERADMIN already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'SUPERADMIN' }
    });

    if (existingAdmin) {
      console.log('SUPERADMIN already exists:', existingAdmin.email);
      // Update password to ensure it's known
      const hashedPassword = await hashPassword('admin123');
      await prisma.user.update({
        where: { email: 'admin@mealnetworks.com' },
        data: { password: hashedPassword }
      });
      console.log('Password reset to: admin123');
      return;
    }

    // Create SUPERADMIN user
    const hashedPassword = await hashPassword('admin123'); // Change this password!
    
    const superAdmin = await prisma.user.create({
      data: {
        email: 'admin@mealnetworks.com',
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        role: 'SUPERADMIN',
        status: 'APPROVED', // SUPERADMIN is automatically approved
        approvedAt: new Date()
      }
    });

    console.log('SUPERADMIN created successfully:');
    console.log('Email:', superAdmin.email);
    console.log('Password: admin123');
    console.log('⚠️  IMPORTANT: Change the password after first login!');

  } catch (error) {
    console.error('Error creating SUPERADMIN:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin();
