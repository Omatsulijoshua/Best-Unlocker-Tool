import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { guideCategories, guides, plans } from "../src/lib/content";
import { deviceChipsets, deviceModels } from "../src/lib/devices";

const prisma = new PrismaClient();

async function main() {
  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { name: plan.name },
      update: plan,
      create: plan
    });
  }

  for (const name of guideCategories) {
    await prisma.recoveryCategory.upsert({
      where: { slug: name.toLowerCase().replaceAll(" ", "-").replaceAll("and", "and") },
      update: {},
      create: { name, slug: name.toLowerCase().replaceAll(" ", "-") }
    });
  }

  for (const guide of guides) {
    const category = await prisma.recoveryCategory.findUniqueOrThrow({
      where: { slug: guide.category.toLowerCase().replaceAll(" ", "-") }
    });
    const data = {
      slug: guide.slug,
      title: guide.title,
      excerpt: guide.excerpt,
      body: guide.body,
      categoryId: category.id
    };
    await prisma.recoveryGuide.upsert({
      where: { slug: guide.slug },
      update: data,
      create: data
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@bestunlocker.local";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMeNow!123";
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN", status: "APPROVED", emailVerifiedAt: new Date() },
    create: {
      name: "Demo Admin",
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 12),
      role: "ADMIN",
      status: "APPROVED",
      emailVerifiedAt: new Date()
    }
  });

  for (const chipset of deviceChipsets) {
    await prisma.deviceChipset.upsert({
      where: { slug: chipset.slug },
      update: chipset,
      create: chipset
    });
  }

  for (const model of deviceModels) {
    const brand = await prisma.deviceBrand.upsert({
      where: { slug: model.brand.toLowerCase().replaceAll(" ", "-") },
      update: { name: model.brand },
      create: { name: model.brand, slug: model.brand.toLowerCase().replaceAll(" ", "-") }
    });
    const chipset = await prisma.deviceChipset.findUniqueOrThrow({ where: { slug: model.chipsetSlug } });
    await prisma.deviceModel.upsert({
      where: { slug: model.slug },
      update: {
        brandId: brand.id,
        chipsetId: chipset.id,
        name: model.name,
        aliases: model.aliases,
        platform: model.platform,
        supportedModes: model.supportedModes,
        safeOperations: model.safeOperations,
        officialNotes: model.officialNotes,
        riskNotes: model.riskNotes
      },
      create: {
        brandId: brand.id,
        chipsetId: chipset.id,
        name: model.name,
        slug: model.slug,
        aliases: model.aliases,
        platform: model.platform,
        supportedModes: model.supportedModes,
        safeOperations: model.safeOperations,
        officialNotes: model.officialNotes,
        riskNotes: model.riskNotes
      }
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
