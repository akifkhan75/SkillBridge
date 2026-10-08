import { PrismaClient } from '@prisma/client';
import { CATALOG } from './catalog-data';

/**
 * Idempotent: safe to run on every deploy and in production. It only creates/updates catalog
 * reference rows (matched by stable keys) and never deletes anything, so existing jobs and
 * worker skills keep pointing at the same rows.
 */
export async function seedCatalog(prisma: PrismaClient) {
  {
    for (const [index, c] of CATALOG.entries()) {
      const category = await prisma.serviceCategory.upsert({
        where: { name: c.name },
        create: {
          name: c.name, description: c.description, iconName: c.icon, sortOrder: index,
          translations: { ur: { name: c.tr.ur }, ar: { name: c.tr.ar }, en: { name: c.en } },
        },
        update: {
          description: c.description, iconName: c.icon, sortOrder: index,
          translations: { ur: { name: c.tr.ur }, ar: { name: c.tr.ar }, en: { name: c.en } },
        },
      });

      for (const [n, s] of c.services.entries()) {
        const existing = await prisma.service.findFirst({ where: { categoryId: category.id, name: s.en } });
        const data = { sortOrder: n, translations: { ur: { name: s.ur } } };
        if (existing) await prisma.service.update({ where: { id: existing.id }, data });
        else await prisma.service.create({ data: { categoryId: category.id, name: s.en, ...data } });
      }

      for (const [n, issue] of c.issues.entries()) {
        const data = { name: issue.en, sortOrder: n, translations: { ur: { name: issue.tr.ur }, ar: { name: issue.tr.ar } } };
        await prisma.serviceIssue.upsert({
          where: { categoryId_code: { categoryId: category.id, code: issue.code } },
          create: { categoryId: category.id, code: issue.code, ...data },
          update: data,
        });
      }
    }
    const [categories, services, issues] = await Promise.all([
      prisma.serviceCategory.count(), prisma.service.count(), prisma.serviceIssue.count(),
    ]);
    console.log(`Catalog ready: ${categories} categories, ${services} services, ${issues} common problems`);
  }
}

if (require.main === module) {
  const prisma = new PrismaClient();
  seedCatalog(prisma)
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
}
