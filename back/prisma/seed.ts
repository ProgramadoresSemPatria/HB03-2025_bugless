import prisma from '../src/database/prisma';
import { StatusSubmissionEnum } from '../src/generated/prisma/enums';

async function main() {
  console.log('🌱 Seeding database...');

  // Create StatusSubmission records
  const statuses = [
    StatusSubmissionEnum.PENDING,
    StatusSubmissionEnum.COMPLETED,
    StatusSubmissionEnum.FAILED
  ];

  for (const status of statuses) {
    const existing = await prisma.statusSubmission.findFirst({
      where: { name: status },
    });

    if (!existing) {
      await prisma.statusSubmission.create({
        data: { name: status },
      });
      console.log(`  ✅ Created StatusSubmission: ${status}`);
    } else {
      console.log(`  ⏭️  StatusSubmission already exists: ${status}`);
    }
  }

  console.log('🌱 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
