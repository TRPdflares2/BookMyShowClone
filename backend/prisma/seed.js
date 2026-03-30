const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();
async function main() {
  const password = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@movie.com" },
    update: {},
    create: {
      email: "admin@movie.com",
      password: password,
      role: "ADMIN",
    },
  });

  console.log("Admin created:", admin);
}
main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());